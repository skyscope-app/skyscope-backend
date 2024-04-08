import { AirportGate } from '@/airports/domain/airport_gate';
import { AirportRunway } from '@/airports/domain/airport_runway';
import { Airport } from '@/airports/domain/airports.entity';
import { Nullable, assertNullable } from '@/shared/utils/nullable';
import { ApiProperty } from '@nestjs/swagger';

export class AirportRunwayResponse {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  gradient: number;
  @ApiProperty()
  magneticBearing: number;
  @ApiProperty()
  trueBearing: number;
  @ApiProperty()
  elevation: number;
  @ApiProperty()
  length: number;
  @ApiProperty()
  width: number;
  @ApiProperty()
  ilsCategory: Nullable<string>;

  constructor(airportRunway: AirportRunway) {
    this.identifier = airportRunway.identifier;
    this.latitude = airportRunway.latitude;
    this.longitude = airportRunway.longitude;
    this.gradient = airportRunway.gradient;
    this.magneticBearing = airportRunway.magneticBearing;
    this.trueBearing = airportRunway.trueBearing;
    this.elevation = airportRunway.elevation;
    this.length = airportRunway.length;
    this.width = airportRunway.width;
    this.ilsCategory = assertNullable(airportRunway.ilsCategory);
  }
}

export class AirportGateResponse {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;

  constructor(airportGate: AirportGate) {
    this.identifier = airportGate.identifier;
    this.latitude = airportGate.latitude;
    this.longitude = airportGate.longitude;
  }
}

export class AirportResponse {
  @ApiProperty()
  icao: string;
  @ApiProperty()
  iata: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;
  @ApiProperty()
  elevation: number;
  @ApiProperty()
  transitionAltitude: number;
  @ApiProperty({ required: false })
  transitionLevel: Nullable<number>;
  @ApiProperty({ type: AirportGateResponse })
  gates: AirportGateResponse[];
  @ApiProperty({ type: AirportRunwayResponse })
  runways: AirportRunwayResponse[];

  constructor(airport: Airport) {
    this.icao = airport.icao;
    this.iata = airport.iata;
    this.name = airport.name;
    this.lat = airport.latitude;
    this.lng = airport.longitude;
    this.elevation = airport.elevation;
    this.gates = airport.gates.map((gate) => new AirportGateResponse(gate));
    this.transitionAltitude = airport.transitionAltitude;
    this.transitionLevel = assertNullable(airport.transitionLevel);
    this.runways = airport.runways.map(
      (runway) => new AirportRunwayResponse(runway),
    );
  }
}
