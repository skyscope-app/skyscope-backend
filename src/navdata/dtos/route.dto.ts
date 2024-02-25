import { ApiProperty } from '@nestjs/swagger';

enum RouteSegmentType {
  SID = 'SID',
  STAR = 'STAR',
  AIRWAY = 'AIRWAY',
}

class Segment {
  @ApiProperty({ enum: RouteSegmentType })
  type: RouteSegmentType;
  @ApiProperty()
  name: string;

  constructor(obj: any) {
    if (obj.stage === 'CLB' && obj.is_sid_star === '1') {
      this.type = RouteSegmentType.SID;
    } else if (obj.stage === 'DSC' && obj.is_sid_star === '1') {
      this.type = RouteSegmentType.STAR;
    } else {
      this.type = RouteSegmentType.AIRWAY;
    }

    this.name = obj.via_airway;
  }
}

class RoutePoint {
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;
  @ApiProperty()
  ident: string;
  @ApiProperty({ type: Segment })
  segment: Segment;

  constructor(obj: any) {
    this.ident = obj.ident;
    this.lat = Number(obj.pos_lat);
    this.lng = Number(obj.pos_long);
    this.segment = new Segment(obj);
  }
}

class Airport {
  @ApiProperty()
  icao: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;

  constructor(obj: any) {
    this.lat = Number(obj.pos_lat);
    this.lng = Number(obj.pos_long);
    this.icao = obj.icao_code;
    this.name = obj.name;
  }
}

export class Route {
  @ApiProperty({ type: Airport })
  departure: Airport;
  @ApiProperty({ type: [RoutePoint] })
  points: RoutePoint[];
  @ApiProperty({ type: Airport })
  arrival: Airport;

  constructor(obj: any) {
    this.departure = new Airport(obj.origin);
    this.points = obj.navlog.fix
      .map((d) => new RoutePoint(d))
      .filter(
        (p) =>
          ![
            obj.destination.icao_code,
            obj.origin.icao_code,
            'TOC',
            'TOD',
          ].includes(p.ident),
      );
    this.arrival = new Airport(obj.destination);
  }
}
