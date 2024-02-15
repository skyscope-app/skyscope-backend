import { getAircraftType } from '@/networks/functions/getAircraftType';
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
    this.icao = aircraft.icao;
    this.wakeTurbulence = aircraft.wakeTurbulence;
    this.registration = aircraft.registration;
    this.transponderTypes = aircraft.transponderTypes;
    this.equipment = aircraft.equipment;
    this.type = getAircraftType(aircraft);
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

class LiveFlightGeoJsonFeaturePropertiesAirport {
  @ApiProperty()
  icao: string;
  @ApiProperty()
  iata: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ isArray: true, example: [-45, -23] })
  coordinates: number[];

  constructor(airport: Airport) {
    this.icao = airport.icao;
    this.iata = airport.iata;
    this.name = airport.name;
    this.coordinates = airport.coordinates;
  }
}
class LiveFlightGeoJsonFeaturePropertiesAircraft {
  @ApiProperty()
  icao: string;
  @ApiProperty()
  registration: string;
  @ApiProperty()
  type: string;

  constructor(aircraft: Aircraft) {
    this.icao = aircraft.icao;
    this.registration = aircraft.registration;
    this.type = aircraft.type;
  }
}

class LiveFlightGeoJsonFeaturePropertiesFlightPlan {
  @ApiProperty({ type: LiveFlightGeoJsonFeaturePropertiesAircraft })
  aircraft: LiveFlightGeoJsonFeaturePropertiesAircraft;
  @ApiProperty({ type: LiveFlightGeoJsonFeaturePropertiesAirport })
  departure: LiveFlightGeoJsonFeaturePropertiesAirport;
  @ApiProperty({ type: LiveFlightGeoJsonFeaturePropertiesAirport })
  arrival: LiveFlightGeoJsonFeaturePropertiesAirport;
  @ApiProperty()
  flightRules: string;

  constructor(flightPlan: FlightPlan) {
    this.aircraft = new LiveFlightGeoJsonFeaturePropertiesAircraft(
      flightPlan.aircraft,
    );
    this.departure = new LiveFlightGeoJsonFeaturePropertiesAirport(
      flightPlan.departure,
    );
    this.arrival = new LiveFlightGeoJsonFeaturePropertiesAirport(
      flightPlan.arrival,
    );
    this.flightRules = flightPlan.flightRules;
  }
}

class LiveFlightGeoJsonFeaturePropertiesPosition {
  @ApiProperty({ isArray: true, example: [-45, -23] })
  coordinates: number[];
  @ApiProperty()
  altitude: number;
  @ApiProperty()
  heading: number;

  constructor(position: Position) {
    this.coordinates = position.coordinates;
    this.altitude = position.altitude;
    this.heading = position.heading;
  }
}

class LiveFlightGeoJsonFeatureProperties {
  @ApiProperty()
  network: string;
  @ApiProperty()
  callsign: string;
  @ApiProperty()
  pilot: Pilot;
  @ApiProperty({ type: LiveFlightGeoJsonFeaturePropertiesPosition })
  currentPosition: LiveFlightGeoJsonFeaturePropertiesPosition;
  @ApiProperty({ type: LiveFlightGeoJsonFeaturePropertiesFlightPlan })
  flightPlan: LiveFlightGeoJsonFeaturePropertiesFlightPlan | null;

  constructor(liveFlight: LiveFlight) {
    this.network = liveFlight.network;
    this.callsign = liveFlight.callsign;
    this.pilot = liveFlight.pilot;
    this.currentPosition = new LiveFlightGeoJsonFeaturePropertiesPosition(
      liveFlight.position,
    );
    this.flightPlan = liveFlight.flightPlan
      ? new LiveFlightGeoJsonFeaturePropertiesFlightPlan(liveFlight.flightPlan)
      : null;
  }
}

class LiveFlightGeoJsonFeatureGeometry {
  @ApiProperty()
  type: string;
  @ApiProperty({ isArray: true, example: [-45, -23] })
  coordinates: number[];

  constructor(position: Position) {
    this.type = 'Point';
    this.coordinates = position.coordinates;
  }
}

class LiveFlightGeoJsonFeature {
  @ApiProperty()
  type: string;
  @ApiProperty()
  id: string;
  @ApiProperty({ type: LiveFlightGeoJsonFeatureProperties })
  properties: LiveFlightGeoJsonFeatureProperties;
  @ApiProperty({ type: LiveFlightGeoJsonFeatureGeometry })
  geometry: LiveFlightGeoJsonFeatureGeometry;

  constructor(liveFlight: LiveFlight) {
    this.type = 'Feature';
    this.id = liveFlight.id;
    this.properties = new LiveFlightGeoJsonFeatureProperties(liveFlight);
    this.geometry = new LiveFlightGeoJsonFeatureGeometry(liveFlight.position);
  }
}

export class LiveFlightGeoJson {
  @ApiProperty()
  type: string;

  @ApiProperty({ type: [LiveFlightGeoJsonFeature] })
  features: LiveFlightGeoJsonFeature[];

  constructor(liveFlights: LiveFlight[]) {
    this.type = 'FeatureCollection';
    this.features = liveFlights.map(
      (liveFlight) => new LiveFlightGeoJsonFeature(liveFlight),
    );
  }
}
