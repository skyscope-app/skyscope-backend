enum RouteSegmentType {
  SID = 'SID',
  STAR = 'STAR',
  AIRWAY = 'AIRWAY',
}

export class Segment {
  public readonly type: RouteSegmentType;
  public readonly name: string;

  constructor(segment: Segment) {
    this.type = segment.type;
    this.name = segment.name;
  }
}

export class RoutePoint {
  public readonly latitude: number;
  public readonly longitude: number;
  public readonly identifier: string;
  public readonly segment: Segment;

  constructor(routePoint: RoutePoint) {
    this.latitude = routePoint.latitude;
    this.longitude = routePoint.longitude;
    this.identifier = routePoint.identifier;
    this.segment = routePoint.segment;
  }
}

export class Airport {
  public readonly icao: string;
  public readonly name: string;
  public readonly latitude: number;
  public readonly longitude: number;

  constructor(airport: Airport) {
    this.icao = airport.icao;
    this.name = airport.name;
    this.latitude = airport.latitude;
    this.longitude = airport.longitude;
  }
}

export class Route {
  public readonly departure: Airport;
  public readonly points: RoutePoint[];
  public readonly arrival: Airport;

  constructor(route: Route) {
    this.departure = route.departure;
    this.points = route.points;
    this.arrival = route.arrival;
  }
}
