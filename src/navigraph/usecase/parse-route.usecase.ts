import {
  Airport,
  Route,
  RoutePoint,
  RouteSegmentType,
  Segment,
} from '@/navigraph/domain/route';
import { NavigraphAirportsService } from '@/navigraph/services/airports.service';
import { BaseService } from '@/navigraph/services/base.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';

enum RoutePointType {
  AIRPORT = 'AIRPORT',
  ENROUTE_WAYPOINT = 'ENROUTE_WAYPOINT',
  TERMINAL_WAYPOINT = 'TERMINAL_WAYPOINT',
  AIRWAY = 'AIRWAY',
  SID = 'SID',
  STAR = 'STAR',
  VOR = 'VOR',
  ENROUTE_NDB = 'ENROUTE_NDB',
  TERMINAL_NDB = 'TERMINAL_NDB',
  DCT = 'DCT',
  COORDINATES = 'COORDINATES',
}

type detail = { type: RoutePointType; identifier: string };

@Injectable()
export class NavigraphParseRouteUseCase extends BaseService {
  constructor(
    @InjectDataSource('current')
    currentDataSource: DataSource,
    @InjectDataSource('outdated')
    outdatedDataSource: DataSource,
    clsService: ClsService,
    private readonly airportService: NavigraphAirportsService,
  ) {
    super(currentDataSource, outdatedDataSource, clsService);
  }

  async run(route: string): Promise<Route> {
    const segments = route.split(' ').map((segment) => segment.split('/')[0]);

    const detailed = await this.detailMany(segments);

    const [departure, destination] = await this.getAirports(
      detailed.filter((d) => d),
    );

    if (!departure || !destination) {
      throw new UnprocessableEntityException(
        'Invalid route. Departure or arrival not found',
      );
    }

    const trios = detailed
      .slice(0, detailed.length - 2)
      .map((d) => d ?? { type: RoutePointType.DCT, identifier: 'DCT' })
      .map((d, i) => {
        return [d, detailed[i + 1], detailed[i + 2]];
      });

    const points = await Promise.all(
      trios.map(([a, b, c]) => this.getSegments(a, b, c)),
    ).then((result) => result.flatMap((r) => r));

    return new Route({
      points,
      departure: Airport.fromNavigraph(departure),
      arrival: Airport.fromNavigraph(destination),
    });
  }

  private async getSegments(
    a: detail,
    b: detail,
    c: detail,
  ): Promise<RoutePoint[]> {
    const valid = [
      RoutePointType.AIRWAY,
      RoutePointType.SID,
      RoutePointType.STAR,
      RoutePointType.DCT,
    ];

    if (!b) {
      return [];
    }

    if (!valid.includes(b.type)) {
      const validDct = [
        RoutePointType.ENROUTE_WAYPOINT,
        RoutePointType.TERMINAL_WAYPOINT,
        RoutePointType.VOR,
        RoutePointType.ENROUTE_NDB,
        RoutePointType.TERMINAL_NDB,
        RoutePointType.COORDINATES,
      ];

      const validFirstSegment =
        validDct.includes(b.type) && validDct.includes(a.type);

      if (validFirstSegment) {
        const ab = validFirstSegment ? await this.getPointsFromDct(a, b) : [];

        return ab.slice(1);
      }

      return [];
    }

    switch (b.type) {
      case RoutePointType.DCT: {
        return this.getPointsFromDct(a, c);
      }
      case RoutePointType.AIRWAY: {
        return this.getPointsFromAirway(a, b, c);
      }
      case RoutePointType.SID: {
        return this.getPointsFromSid(b, c);
      }
      default: {
        return this.getPointsFromStar(a, b);
      }
    }
  }

  private async getPointsFromSid(
    sid: detail,
    transition: detail,
  ): Promise<RoutePoint[]> {
    const query = `select waypoint_identifier as identifier,
                          waypoint_latitude   as latitude,
                          waypoint_longitude  as longitude,
                          waypoint_identifier as segmentName
                   from tbl_sids sids
                   where sids.procedure_identifier = $1
                     and (sids.transition_identifier = $2
                       OR sids.route_type = 5)
                     and waypoint_identifier is not null
                   order by sids.route_type, sids.seqno `;

    const result: any[] = await this.datasource().query(query, [
      sid.identifier,
      transition.identifier,
    ]);

    const waypoints = new Set(result.map((p: any) => p.identifier as string));

    const map = new Map(
      result.map((d: any) => [
        d.identifier as string,
        new RoutePoint({
          identifier: d.identifier,
          segment: new Segment({
            type: RouteSegmentType.SID,
            name: sid.identifier,
          }),
          longitude: d.longitude,
          latitude: d.latitude,
        }),
      ]),
    );

    return Array.from(waypoints).map((waypoint) => map.get(waypoint)!);
  }

  private async getPointsFromStar(
    transition: detail,
    star: detail,
  ): Promise<RoutePoint[]> {
    const query = `select waypoint_identifier as identifier,
                          waypoint_latitude   as latitude,
                          waypoint_longitude  as longitude,
                          waypoint_identifier as segmentName
                   from tbl_stars stars
                   where stars.procedure_identifier = $1
                     and (stars.transition_identifier = $2 OR stars.route_type = 6 OR stars.route_type = 5) 
                   order by stars.route_type, stars.seqno  `;

    const result: any[] = await this.datasource().query(query, [
      star.identifier,
      transition.identifier,
    ]);

    const waypoints = new Set(result.map((p: any) => p.identifier as string));

    const map = new Map(
      result.map((d: any) => [
        d.identifier as string,
        new RoutePoint({
          identifier: d.identifier,
          segment: new Segment({
            type: RouteSegmentType.STAR,
            name: star.identifier,
          }),
          longitude: d.longitude,
          latitude: d.latitude,
        }),
      ]),
    );

    return Array.from(waypoints).map((waypoint) => map.get(waypoint)!);
  }

  private async getPointsFromAirway(
    from: detail,
    airway: detail,
    to: detail,
  ): Promise<RoutePoint[]> {
    const query = `select waypoint_identifier as identifier,
                          route_identifier    as segmentName,
                          waypoint_latitude   as latitude,
                          waypoint_longitude  as longitude
                   from tbl_enroute_airways tea
                   where tea.route_identifier = $1
                     and tea.seqno between (select MIN(seqno)
                                            from tbl_enroute_airways tea
                                            where tea.route_identifier = $1
                                              AND tea.waypoint_identifier IN ($2, $3))
                       and (select MAX(seqno)
                            from tbl_enroute_airways tea
                            where tea.route_identifier = $1
                              AND tea.waypoint_identifier IN ($2, $3))
                              order by case when tea.direction_restriction = 'B' then -tea.seqno  else tea.seqno  end
                              `;

    const result = await this.datasource().query(query, [
      airway.identifier,
      from.identifier,
      to.identifier,
    ]);

    const order = result[0].identifier === from.identifier ? 1 : -1;

    return result
      .sort(() => order)
      .map((d) => {
        const { identifier, segmentName, latitude, longitude } = d;
        return new RoutePoint({
          identifier,
          segment: new Segment({
            type: RouteSegmentType.AIRWAY,
            name: segmentName,
          }),
          longitude,
          latitude,
        });
      })
      .slice(1);
  }

  private async getPointsFromDct(
    from: detail,
    to: detail,
  ): Promise<RoutePoint[]> {
    const points = await Promise.all(
      [from, to].map(async ({ identifier, type }) => {
        switch (type) {
          case RoutePointType.ENROUTE_WAYPOINT:
            return await this.getEnrouteWaypoint(identifier).then((r) => [r]);
          case RoutePointType.TERMINAL_WAYPOINT:
            return await this.getTerminalWaypoint(identifier).then((r) => [r]);
          case RoutePointType.ENROUTE_NDB:
            return await this.getEnrouteNDB(identifier).then((r) => [r]);
          case RoutePointType.TERMINAL_NDB:
            return await this.getTerminalNDB(identifier).then((r) => [r]);
          case RoutePointType.VOR:
            return await this.getVOR(identifier).then((r) => [r]);
          case RoutePointType.COORDINATES:
            return await this.getCoordinates(identifier).then((r) => [r]);
          default:
            return [];
        }
      }),
    );

    return points.flatMap((r) => r);
  }
  private async getCoordinates(identifier: string): Promise<RoutePoint> {
    let latitude = 0;
    let longitude = 0;

    //21N165E
    if (/(\d{2}[NS])(\d{3}[EW])/.test(identifier)) {
      latitude = Number(identifier.slice(0, 2));
      longitude = Number(identifier.slice(2, 5));

      if (identifier.slice(2, 3) === 'S') latitude = -latitude;
      if (identifier.slice(5, 6) === 'W') longitude = -longitude;
    }

    //2101S16500E
    else if (/(\d{4}[NS])(\d{5}[EW])/.test(identifier)) {
      latitude = Number(identifier.slice(0, 4)) / 100;
      longitude = Number(identifier.slice(5, 10)) / 100;

      if (identifier.slice(4, 5) === 'S') latitude = -latitude;
      if (identifier.slice(9, 10) === 'W') longitude = -longitude;
    }

    return new RoutePoint({
      identifier,
      latitude,
      longitude,
      segment: new Segment({
        name: identifier,
        type: RouteSegmentType.COORDINATES,
      }),
    });
  }

  private async getAirports(detailed: detail[]) {
    const icaos = detailed
      .filter((d) => d.type === RoutePointType.AIRPORT)
      .map((d) => d.identifier);

    const airports = await Promise.all(
      icaos.map((icao) => this.airportService.findByICAO(icao)),
    );

    return airports;
  }

  private async detailMany(identifiers: string[]): Promise<detail[]> {
    const out: detail[] = [];

    identifiers.forEach((identifier) => {
      if (identifier === 'DCT') {
        out.push({
          type: RoutePointType.DCT,
          identifier: identifier,
        });
      }

      //21N165E
      if (/(\d{2}[NS])(\d{3}[EW])/.test(identifier)) {
        out.push({
          type: RoutePointType.COORDINATES,
          identifier: identifier,
        });
      }

      //2101S16500E
      if (/(\d{4}[NS])(\d{5}[EW])/.test(identifier)) {
        out.push({
          type: RoutePointType.COORDINATES,
          identifier: identifier,
        });
      }
    });

    const unknowIdentifiers = identifiers.filter(
      (i) => !out.some((o) => o.identifier === i),
    );

    const queryValues = unknowIdentifiers
      .map((identifier) => `('${identifier}')`)
      .join(',');

    const datasource = this.datasource();

    const query = `WITH identifiers (identifier) AS (VALUES ${queryValues})

              SELECT *,
              CASE
              WHEN (select count(*) from tbl_airports airports where airports.airport_identifier = identifier) > 0 THEN 'AIRPORT'
              WHEN (select count(*) from tbl_enroute_waypoints enroute_waypoints where enroute_waypoints.waypoint_identifier = identifier) > 0 THEN 'ENROUTE_WAYPOINT'
              WHEN (select count(*) from tbl_terminal_waypoints terminal_waypoints where terminal_waypoints.waypoint_identifier = identifier) > 0 THEN 'TERMINAL_WAYPOINT'
              WHEN (select count(*) from tbl_enroute_airways airway where airway.route_identifier = identifier) > 0 THEN 'AIRWAY'
              WHEN (select count(*) from tbl_sids sids where sids.procedure_identifier = identifier) > 0 THEN 'SID'
              WHEN (select count(*) from tbl_stars stars where stars.procedure_identifier = identifier) > 0 THEN 'STAR'
              WHEN (select count(*) from tbl_vhfnavaids vors where vors.vor_identifier = identifier) > 0 THEN 'VOR'
              WHEN (select count(*) from tbl_enroute_ndbnavaids endbs where endbs.ndb_identifier = identifier) > 0 THEN 'ENROUTE_NDB'
              WHEN (select count(*) from tbl_terminal_ndbnavaids tndbs where tndbs.ndb_identifier = identifier) > 0 THEN 'TERMINAL_NDB'
              WHEN identifier = 'DCT' THEN 'DCT'
              END as type
              FROM identifiers

    `;

    const result = await datasource.query(query);

    return result;
  }

  private async getEnrouteWaypoint(identifier: string): Promise<RoutePoint> {
    const query = `select waypoint_latitude as latitude, waypoint_longitude as longitude
                   from tbl_enroute_waypoints
                   where waypoint_identifier = $1`;

    const [{ latitude, longitude }] = await this.datasource().query(query, [
      identifier,
    ]);

    return new RoutePoint({
      identifier,
      segment: new Segment({
        type: RouteSegmentType.WAYPOINT,
        name: identifier,
      }),
      longitude,
      latitude,
    });
  }

  private async getTerminalWaypoint(identifier: string) {
    const query = `select waypoint_latitude as latitude, waypoint_longitude as longitude
                   from tbl_terminal_waypoints
                   where waypoint_identifier = $1`;

    const [{ latitude, longitude }] = await this.datasource().query(query, [
      identifier,
    ]);

    return new RoutePoint({
      identifier,
      segment: new Segment({
        type: RouteSegmentType.WAYPOINT,
        name: identifier,
      }),
      longitude,
      latitude,
    });
  }

  private async getEnrouteNDB(identifier: string) {
    const query = `select ndb_latitude as latitude, ndb_longitude as longitude
                   from tbl_enroute_ndbnavaids
                   where ndb_identifier = $1`;

    const [{ latitude, longitude }] = await this.datasource().query(query, [
      identifier,
    ]);

    return new RoutePoint({
      identifier,
      segment: new Segment({
        type: RouteSegmentType.NDB,
        name: identifier,
      }),
      longitude,
      latitude,
    });
  }

  private async getTerminalNDB(identifier: string) {
    const query = `select ndb_latitude as latitude, ndb_longitude as longitude
                   from tbl_terminal_ndbnavaids
                   where ndb_identifier = $1`;

    const [{ latitude, longitude }] = await this.datasource().query(query, [
      identifier,
    ]);

    return new RoutePoint({
      identifier,
      segment: new Segment({
        type: RouteSegmentType.NDB,
        name: identifier,
      }),
      longitude,
      latitude,
    });
  }

  private async getVOR(identifier: string) {
    const query = `select vor_latitude as latitude, vor_longitude as longitude
                   from tbl_vhfnavaids
                   where vor_identifier = $1`;

    const [{ latitude, longitude }] = await this.datasource().query(query, [
      identifier,
    ]);

    return new RoutePoint({
      identifier,
      segment: new Segment({
        type: RouteSegmentType.VOR,
        name: identifier,
      }),
      longitude,
      latitude,
    });
  }
}
