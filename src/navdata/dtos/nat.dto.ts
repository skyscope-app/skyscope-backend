import { ApiProperty } from '@nestjs/swagger';

export enum NatWaypointType {
  FIX = 'FIX',
  LATLON = 'LATLON',
}

export class NatWaypoint {
  @ApiProperty({ example: 'ERAKA' })
  ident: string;
  @ApiProperty({ enum: NatWaypointType })
  type: NatWaypointType;
  @ApiProperty({ example: -58 })
  latitude: number;
  @ApiProperty({ example: -30 })
  longitude: number;

  constructor(obj: any) {
    this.ident = obj.ident;
    this.type = obj.type;
    this.latitude = Number(obj.lat);
    this.longitude = Number(obj.lon);
  }
}

export class Nat {
  @ApiProperty({ example: 'A' })
  ident: string;
  @ApiProperty({ type: () => NatWaypoint, isArray: true })
  waypoints: NatWaypoint[];
  @ApiProperty({ format: 'date-time' })
  validFrom: Date;
  @ApiProperty({ format: 'date-time' })
  validTo: Date;
  @ApiProperty({ isArray: true, type: 'string', example: ['370', '390'] })
  eastLevels: string[];
  @ApiProperty({ isArray: true, type: 'string', example: ['370', '390'] })
  westLevels: string[];

  constructor(obj: any) {
    this.ident = obj.ident;
    this.waypoints = obj.route.nodes.map((w: any) => new NatWaypoint(w));
    this.validFrom = new Date(obj.validFrom);
    this.validTo = new Date(obj.validTo);
    this.eastLevels = obj.route.eastLevels;
    this.westLevels = obj.route.westLevels;
  }
}
