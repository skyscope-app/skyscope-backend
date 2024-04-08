import { Airport, Route, RoutePoint, Segment } from '@/navigraph/domain/route';
import { ApiProperty } from '@nestjs/swagger';

enum RouteSegmentType {
  SID = 'SID',
  STAR = 'STAR',
  AIRWAY = 'AIRWAY',
  WAYPOINT = 'WAYPOINT',
  VOR = 'VOR',
  NDB = 'NDB',
}

class SegmentResponse {
  @ApiProperty({ enum: RouteSegmentType })
  type: RouteSegmentType;
  @ApiProperty()
  name: string;

  constructor(segmentResponse: SegmentResponse) {
    this.type = segmentResponse.type;
    this.name = segmentResponse.name;
  }

  static fromSimbrief(obj: any) {
    let type = RouteSegmentType.AIRWAY;

    if (obj.stage === 'CLB' && obj.is_sid_star === '1') {
      type = RouteSegmentType.SID;
    } else if (obj.stage === 'DSC' && obj.is_sid_star === '1') {
      type = RouteSegmentType.STAR;
    }

    const name = obj.via_airway;

    return new SegmentResponse({
      type,
      name,
    });
  }

  static fromNavigraph(segment: Segment) {
    const response = new SegmentResponse({
      type: segment.type,
      name: segment.name,
    });

    return response;
  }
}

class RoutePointResponse {
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  identifier: string;
  @ApiProperty({ type: Segment })
  segment: Segment;

  constructor(routePointResponse: RoutePointResponse) {
    this.latitude = routePointResponse.latitude;
    this.longitude = routePointResponse.longitude;
    this.identifier = routePointResponse.identifier;
    this.segment = routePointResponse.segment;
  }

  static fromSimbrief(obj: any) {
    const identifier = obj.ident;
    const latitude = Number(obj.pos_lat);
    const longitude = Number(obj.pos_long);
    const segment = SegmentResponse.fromSimbrief(obj);

    return new RoutePointResponse({ identifier, latitude, longitude, segment });
  }

  static fromNavigraph(routePoint: RoutePoint) {
    const identifier = routePoint.identifier;
    const latitude = routePoint.latitude;
    const longitude = routePoint.longitude;
    const segment = new Segment(routePoint.segment);

    return new RoutePointResponse({
      identifier,
      latitude,
      longitude,
      segment,
    });
  }
}

class AirportResponse {
  @ApiProperty()
  icao: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;

  constructor(airportResponse: AirportResponse) {
    this.icao = airportResponse.icao;
    this.name = airportResponse.name;
    this.latitude = airportResponse.latitude;
    this.longitude = airportResponse.longitude;
  }

  static fromSimbrief(obj: any) {
    const latitude = Number(obj.pos_lat);
    const longitude = Number(obj.pos_long);
    const icao = obj.icao_code;
    const name = obj.name;

    return new AirportResponse({ latitude, longitude, icao, name });
  }

  static fromNavigraph(airport: Airport) {
    const icao = airport.icao;
    const name = airport.name;
    const latitude = airport.latitude;
    const longitude = airport.longitude;

    return new AirportResponse({ icao, name, latitude, longitude });
  }
}

export class RouteResponse {
  @ApiProperty({ type: Airport })
  departure: AirportResponse;
  @ApiProperty({ type: [RoutePoint] })
  points: RoutePointResponse[];
  @ApiProperty({ type: Airport })
  arrival: AirportResponse;

  constructor(route: RouteResponse) {
    this.departure = route.departure;
    this.points = route.points;
    this.arrival = route.arrival;
  }

  static fromNavigraph(route: Route) {
    const departure = AirportResponse.fromNavigraph(route.departure);
    const points = route.points.map((p) => RoutePointResponse.fromNavigraph(p));
    const arrival = AirportResponse.fromNavigraph(route.arrival);

    return new Route({ departure, points, arrival });
  }

  static fromSimbrief(obj: any) {
    const departure = AirportResponse.fromSimbrief(obj.origin);
    const points = obj.navlog.fix
      .map((d) => RoutePointResponse.fromSimbrief(d))
      .filter(
        (p) =>
          ![
            obj.destination.icao_code,
            obj.origin.icao_code,
            'TOC',
            'TOD',
          ].includes(p.ident),
      );

    const arrival = AirportResponse.fromSimbrief(obj.destination);

    return new Route({ departure, points, arrival });
  }
}
