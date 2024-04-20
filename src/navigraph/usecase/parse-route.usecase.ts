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

    const detailed = await Promise.all(segments.map((s) => this.detailOne(s)));

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
          default:
            return [];
        }
      }),
    );

    return points.flatMap((r) => r);
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

  private async detailOne(identifier: string): Promise<detail> {
    if (identifier === 'DCT') {
      return {
        type: RoutePointType.DCT,
        identifier,
      };
    }

    if (/(\d{2}[NS])(\d{3}[EW])/.test(identifier)) {
      return {
        type: RoutePointType.COORDINATES,
        identifier,
      };
    }

    const datasource = this.datasource();

    const query = `SELECT CASE
                              WHEN airports.airport_identifier = $1 THEN 'AIRPORT'
                              WHEN ewaypoints.waypoint_identifier = $1 THEN 'ENROUTE_WAYPOINT'
                              WHEN twaypoints.waypoint_identifier = $1 THEN 'TERMINAL_WAYPOINT'
                              WHEN tea.route_identifier = $1 THEN 'AIRWAY'
                              WHEN sids.procedure_identifier = $1 THEN 'SID'
                              WHEN stars.procedure_identifier = $1 THEN 'STAR'
                              WHEN vors.vor_identifier = $1 THEN 'VOR'
                              WHEN endbs.ndb_identifier = $1 THEN 'ENROUTE_NDB'
                              WHEN tndbs.ndb_identifier = $1 THEN 'TERMINAL_NDB'
                              WHEN $1 = 'DCT' THEN 'DCT'
                              ELSE 'UNKNOWN'
                              END AS type,
                          $1      as identifier
                   FROM tbl_enroute_airways tea
                            LEFT JOIN
                        tbl_sids sids ON sids.procedure_identifier = $1
                            LEFT JOIN
                        tbl_stars stars ON stars.procedure_identifier = $1
                            LEFT JOIN
                        tbl_vhfnavaids vors ON vors.vor_identifier = $1
                            LEFT JOIN
                        tbl_terminal_ndbnavaids tndbs ON tndbs.ndb_identifier = $1
                            LEFT JOIN
                        tbl_enroute_waypoints ewaypoints ON ewaypoints.waypoint_identifier = $1
                            LEFT JOIN
                        tbl_terminal_waypoints twaypoints ON twaypoints.waypoint_identifier = $1
                            LEFT JOIN
                        tbl_enroute_ndbnavaids endbs ON endbs.ndb_identifier = $1
                            LEFT JOIN
                        tbl_airports airports ON airports.airport_identifier = $1
                   WHERE tea.route_identifier = $1
                      OR sids.procedure_identifier = $1
                      OR stars.procedure_identifier = $1
                      OR vors.vor_identifier = $1
                      OR tndbs.ndb_identifier = $1
                      OR ewaypoints.waypoint_identifier = $1
                      OR twaypoints.waypoint_identifier = $1
                      OR tndbs.ndb_identifier = $1
                      OR endbs.ndb_identifier = $1
                      OR airports.airport_identifier = $1 LIMIT 1
    `;

    const result = await datasource.query(query, [identifier]);

    return result[0];
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
