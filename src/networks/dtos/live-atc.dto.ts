import { assertNullable, Nullable } from '@/shared/utils/nullable';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  rating: string;
  @ApiProperty()
  name: Nullable<string>;

  constructor(id: string, rating: number, name: string | null) {
    this.id = id;
    this.rating = String(rating);
    this.name = assertNullable(name);
  }
}

export enum ATCFacility {
  DEL = 'DEL',
  GND = 'GND',
  TWR = 'TWR',
  APP = 'APP',
  DEP = 'DEP',
  CTR = 'CTR',
  FSS = 'FSS',
  UNKNOW = 'UNKNOW',
}

export class LiveATCPoint {
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

export class LiveATC {
  @ApiProperty()
  network: string;
  @ApiProperty()
  callsign: string;
  @ApiProperty()
  rating: string;
  @ApiProperty()
  user: User;
  @ApiProperty()
  onlineAt: string;
  @ApiProperty()
  atis: string[];
  @ApiProperty()
  frequency: string;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  facility: ATCFacility;
  @ApiProperty()
  geometry: LiveATCPoint[];

  constructor(
    network: string,
    callsign: string,
    rating: string,
    user: User,
    onlineAt: string,
    atis: string[],
    frequency: string,
    latitude: number,
    longitude: number,
    facility: ATCFacility,
    points: [number, number][],
  ) {
    this.network = network;
    this.callsign = callsign;
    this.rating = rating;
    this.user = user;
    this.onlineAt = onlineAt;
    this.atis = atis;
    this.frequency = frequency;
    this.latitude = latitude;
    this.longitude = longitude;
    this.facility = facility;
    this.geometry = points.map(
      ([latitude, longitude]) => new LiveATCPoint(longitude, latitude),
    );
  }
}
