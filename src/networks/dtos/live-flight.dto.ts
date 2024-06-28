import { Airline } from '@/airlines/domain/airline';
import { Airport as AirportDomain } from '@/airports/domain/airports.entity';
import { RouteResponse } from '@/navdata/dtos/route.dto';
import { getAircraftType } from '@/networks/functions/getAircraftType';
import { Nullable, assertNullable } from '@/shared/utils/nullable';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class Pilot {
  @ApiProperty()
  id: number;
  @ApiProperty()
  rating: string;
  @ApiProperty()
  name: string | null;
}

export class Position {
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;
  @ApiProperty()
  altitude: number;
  @ApiProperty()
  heading: number;
  @ApiProperty()
  transponder: string;
  @ApiProperty()
  groundSpeed: number;
  @ApiProperty()
  onGround: boolean;
}

export class Airport {
  @ApiProperty()
  icao: string;
  @ApiProperty({ nullable: true })
  iata: Nullable<string>;
  @ApiProperty()
  name: string;
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;

  constructor(airport: Airport) {
    if (airport) {
      this.icao = airport.icao;
      this.iata = airport.iata;
      this.name = airport.name;
      this.lat = airport.lat;
      this.lng = airport.lng;
    }
  }

  static fromDomain(airport?: AirportDomain) {
    if (airport) {
      return new this({
        iata: airport.iata,
        icao: airport.icao,
        name: airport.name,
        lat: airport.latitude,
        lng: airport.longitude,
      });
    }
  }
}

export enum AircraftType {
  Heavy = 'heavy',
  Helicopter = 'helicopter',
  Super = 'super',
  Light = 'light',
  Medium = 'medium',
  Supersonic = 'supersonic',
  Unknown = 'unknown',
}

export class Aircraft {
  @ApiProperty()
  icao: string;
  @ApiProperty()
  wakeTurbulence: string;
  @ApiProperty()
  registration: string;
  @ApiProperty()
  transponderTypes: string;
  @ApiProperty()
  equipment: string;
  @ApiProperty()
  type: AircraftType;

  constructor(aircraft: Aircraft) {
    if (aircraft) {
      this.icao = aircraft.icao;
      this.wakeTurbulence = aircraft.wakeTurbulence;
      this.registration = aircraft.registration;
      this.transponderTypes = aircraft.transponderTypes;
      this.equipment = aircraft.equipment;
      this.type = getAircraftType(aircraft);
    }
  }
}

export class FlightPlan {
  @ApiProperty()
  flightRules: string;
  @ApiProperty()
  flightType: string;
  @ApiProperty()
  level: number;
  @ApiProperty({ type: () => Airport })
  @Type(() => Airport)
  departure: Airport;
  @ApiProperty({ type: () => Airport })
  @Type(() => Airport)
  arrival: Airport;
  @ApiProperty({ type: () => Aircraft })
  @Type(() => Aircraft)
  aircraft: Aircraft;
  @ApiProperty()
  route: string;
  @ApiProperty()
  remarks: string;
  @ApiProperty()
  cruiseTas: string;
  @ApiProperty()
  departureTime: string;
  @ApiProperty()
  enrouteTime: string;
  @ApiProperty()
  endurance: string;
  @ApiProperty({ type: () => Airport })
  @Type(() => Airport)
  alternate: Airport | null;
  @ApiProperty({ type: () => Airport })
  @Type(() => Airport)
  alternate2: Airport | null;
}

export class AirlineResponse {
  @ApiProperty()
  public readonly id: string;
  @ApiProperty()
  public readonly name: string;
  @ApiProperty()
  public readonly icao: string;
  @ApiProperty()
  public readonly image: string;
  @ApiProperty()
  public readonly callsign: string;

  constructor(airline?: Airline) {
    if (airline) {
      this.id = airline.id;
      this.name = airline.name;
      this.icao = airline.icao;
      this.image = airline.image;
      this.callsign = airline.callsign;
    }
  }
}

export class ReducedLiveFlight {
  @ApiProperty()
  id: string;
  @ApiProperty()
  callsign: string;
  @ApiProperty({ nullable: true })
  departure: Nullable<string>;
  @ApiProperty({ nullable: true })
  departureLat: Nullable<number>;
  @ApiProperty({ nullable: true })
  departureLng: Nullable<number>;
  @ApiProperty({ nullable: true })
  arrival: Nullable<string>;
  @ApiProperty({ nullable: true })
  arrivalLat: Nullable<number>;
  @ApiProperty({ nullable: true })
  arrivalLng: Nullable<number>;
  @ApiProperty({ nullable: true })
  alternative: Nullable<string>;
  @ApiProperty({ nullable: true })
  alternativeLat: Nullable<number>;
  @ApiProperty({ nullable: true })
  alternativeLng: Nullable<number>;
  @ApiProperty({ nullable: true })
  alternative2: Nullable<string>;
  @ApiProperty({ nullable: true })
  alternative2Lat: Nullable<number>;
  @ApiProperty({ nullable: true })
  alternative2Lng: Nullable<number>;
  @ApiProperty({ nullable: true })
  aircraft: Nullable<string>;
  @ApiProperty({ nullable: true })
  aircraftRegistration: Nullable<string>;
  @ApiProperty({ nullable: true })
  aircraftType: Nullable<string>;
  @ApiProperty()
  transponder: string;
  @ApiProperty()
  network: string;
  @ApiProperty()
  pilotId: string;
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;
  @ApiProperty()
  heading: number;

  constructor(liveFlight: LiveFlight) {
    this.id = liveFlight.id;
    this.callsign = liveFlight.callsign;
    this.departure = assertNullable(liveFlight.flightPlan?.departure.icao);
    this.departureLat = assertNullable(liveFlight.flightPlan?.departure.lat);
    this.departureLng = assertNullable(liveFlight.flightPlan?.departure.lng);
    this.arrival = assertNullable(liveFlight.flightPlan?.arrival.icao);
    this.arrivalLat = assertNullable(liveFlight.flightPlan?.arrival.lat);
    this.arrivalLng = assertNullable(liveFlight.flightPlan?.arrival.lng);
    this.alternative = assertNullable(liveFlight.flightPlan?.alternate?.icao);
    this.alternativeLat = assertNullable(liveFlight.flightPlan?.alternate?.lat);
    this.alternativeLng = assertNullable(liveFlight.flightPlan?.alternate?.lng);
    this.alternative2 = assertNullable(liveFlight.flightPlan?.alternate2?.icao);
    this.alternative2Lat = assertNullable(
      liveFlight.flightPlan?.alternate2?.lat,
    );
    this.alternative2Lng = assertNullable(
      liveFlight.flightPlan?.alternate2?.lng,
    );
    this.aircraft = assertNullable(liveFlight.flightPlan?.aircraft.icao);
    this.aircraftRegistration = assertNullable(
      liveFlight.flightPlan?.aircraft.registration,
    );
    this.aircraftType = assertNullable(liveFlight.flightPlan?.aircraft.type);
    this.transponder = liveFlight.position.transponder;
    this.network = liveFlight.network;
    this.pilotId = String(liveFlight.pilot.id);
    this.lat = liveFlight.position.lat;
    this.lng = liveFlight.position.lng;
    this.heading = liveFlight.position.heading;
  }
}

export class LiveFlight {
  @ApiProperty()
  id: string;
  @ApiProperty({ type: () => Pilot })
  pilot: Pilot;
  @ApiProperty({ type: () => Position })
  position: Position;
  @ApiProperty()
  callsign: string;
  @ApiProperty()
  network: string;
  @ApiProperty({ nullable: true, type: () => FlightPlan })
  flightPlan: Nullable<FlightPlan>;
  @ApiProperty({ nullable: true, type: () => AirlineResponse })
  airline: Nullable<AirlineResponse>;

  enrichAirports(airports: Map<string, AirportDomain>) {
    if (this.flightPlan) {
      const departure = Airport.fromDomain(
        airports.get(this.flightPlan.departure.icao),
      );

      const arrival = Airport.fromDomain(
        airports.get(this.flightPlan.arrival.icao),
      );

      if (departure) {
        this.flightPlan.departure = departure;
      }

      if (arrival) {
        this.flightPlan.arrival = arrival;
      }
    }

    if (this.flightPlan?.alternate) {
      const alternate = Airport.fromDomain(
        airports.get(this.flightPlan.alternate.icao),
      );

      if (alternate) {
        this.flightPlan.alternate = alternate;
      }
    }

    if (this.flightPlan?.alternate2) {
      const alternate = Airport.fromDomain(
        airports.get(this.flightPlan.alternate2.icao),
      );

      if (alternate) {
        this.flightPlan.alternate2 = alternate;
      }
    }
  }
}

export class LiveFlightTrack {
  lat: number;
  lng: number;
  altitude: number;
  groundSpeed: number;
  heading: number;
  ground: boolean;
  timestamp: number;

  constructor(data: Omit<LiveFlightTrack, 'encode'>) {
    this.lat = data.lat;
    this.lng = data.lng;
    this.altitude = data.altitude;
    this.groundSpeed = data.groundSpeed;
    this.heading = data.heading;
    this.ground = data.ground;
    this.timestamp = data.timestamp;
  }

  static decode(data: string) {
    const values = data.split(';');
    return new LiveFlightTrack({
      lat: Number(values[0]),
      lng: Number(values[1]),
      altitude: Number(values[2]),
      groundSpeed: Number(values[3]),
      heading: Number(values[4]),
      ground: values[5] === 'true',
      timestamp: Number(values[6]),
    });
  }

  encode() {
    return Object.values(this).join(';');
  }
}

@Expose()
export class LiveFlightWithTracks {
  @ApiProperty()
  id: string;
  @ApiProperty({ type: () => Pilot })
  pilot: Pilot;
  @ApiProperty({ type: () => Position })
  position: Position;
  @ApiProperty()
  callsign: string;
  @ApiProperty()
  network: string;
  @ApiProperty({ nullable: true, type: () => FlightPlan })
  flightPlan: Nullable<FlightPlan>;
  @ApiProperty({ type: () => [LiveFlightTrack] })
  tracks: LiveFlightTrack[];
  @ApiProperty({ type: () => RouteResponse, nullable: true })
  route: Nullable<RouteResponse>;

  enrichAirports(airports: Map<string, AirportDomain>) {
    if (this.flightPlan) {
      const departure = Airport.fromDomain(
        airports.get(this.flightPlan.departure.icao),
      );

      const arrival = Airport.fromDomain(
        airports.get(this.flightPlan.arrival.icao),
      );

      if (departure) {
        this.flightPlan.departure = departure;
      }

      if (arrival) {
        this.flightPlan.arrival = arrival;
      }
    }

    if (this.flightPlan?.alternate) {
      const alternate = Airport.fromDomain(
        airports.get(this.flightPlan.alternate.icao),
      );

      if (alternate) {
        this.flightPlan.alternate = alternate;
      }
    }

    if (this.flightPlan?.alternate2) {
      const alternate = Airport.fromDomain(
        airports.get(this.flightPlan.alternate2.icao),
      );

      if (alternate) {
        this.flightPlan.alternate2 = alternate;
      }
    }
  }
}
