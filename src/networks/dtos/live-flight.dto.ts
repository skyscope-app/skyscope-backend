import { getAircraftType } from '@/networks/functions/getAircraftType';
import { Nullable } from '@/shared/utils/nullable';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
  @ApiProperty()
  iata: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;
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
}
