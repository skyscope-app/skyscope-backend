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
  RMP = 'RMP',
  GND = 'GND',
  TWR = 'TWR',
  AFIS = 'AFIS',
  APP = 'APP',
  DEP = 'DEP',
  CTR = 'CTR',
  FSS = 'FSS',
  UNKNOWN = 'UNKNOWN',
}

export class LiveATCPoint {
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
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
  @ApiProperty({ isArray: true })
  geometry: LiveATCPoint[][];
}
