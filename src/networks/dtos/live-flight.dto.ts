import { ApiProperty } from '@nestjs/swagger';

export class Pilot {
  @ApiProperty()
  id: number;
  @ApiProperty()
  rating: string;
  @ApiProperty()
  name: string | null;
}

export class Position {
  @ApiProperty({ isArray: true, example: [-23, -45] })
  coordinates: number[];
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
  @ApiProperty({ isArray: true, example: [-23, -45] })
  coordinates: number[];
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
}

export class FlightPlan {
  @ApiProperty()
  flightRules: string;
  @ApiProperty()
  flightType: string;
  @ApiProperty()
  level: string;
  @ApiProperty({ type: () => Airport })
  departure: Airport;
  @ApiProperty({ type: () => Airport })
  arrival: Airport;
  @ApiProperty({ type: () => Aircraft })
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
  alternate: Airport | null;
  @ApiProperty({ type: () => Airport })
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
  flightPlan: FlightPlan | null;
}
