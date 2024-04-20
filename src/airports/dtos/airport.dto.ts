import { AirportGate } from '@/airports/domain/airport_gate';
import { AirportRunway } from '@/airports/domain/airport_runway';
import { Airport } from '@/airports/domain/airports.entity';
import { Network, NetworkAirportFlights } from '@/networks/domain/network';
import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { Nullable, assertNullable } from '@/shared/utils/nullable';
import { ApiProperty } from '@nestjs/swagger';

export class AirportSummaryResponse {
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
    this.iata = assertNullable(airport.iata);
    this.name = airport.name;
    this.icao = airport.icao;
    this.lat = airport.latitude;
    this.lng = airport.longitude;
  }
}

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
  iata: Nullable<string>;
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

export class AirportFlight {
  @ApiProperty()
  id: string;
  @ApiProperty()
  callsign: string;
  @ApiProperty({ nullable: true })
  departure: Nullable<string>;
  @ApiProperty({ nullable: true })
  arrival: Nullable<string>;

  constructor(flight: LiveFlight) {
    this.id = flight.id;
    this.callsign = flight.callsign;
    this.arrival = assertNullable(flight.flightPlan?.arrival.icao);
    this.departure = assertNullable(flight.flightPlan?.departure.icao);
  }
}

export class AirportFlights {
  @ApiProperty()
  departure: AirportFlight[];
  @ApiProperty()
  arrival: AirportFlight[];

  constructor(departure: LiveFlight[], arrival: LiveFlight[]) {
    this.departure = departure.map((dep) => new AirportFlight(dep));
    this.arrival = arrival.map((arr) => new AirportFlight(arr));
  }
}

export class NetworksAirportFlights {
  @ApiProperty({ type: AirportFlights })
  ivao: AirportFlights;
  @ApiProperty({ type: AirportFlights })
  vatsim: AirportFlights;

  constructor(ivao: NetworkAirportFlights, vatsim: NetworkAirportFlights) {
    this.ivao = new AirportFlights(ivao.departure, ivao.arrival);
    this.vatsim = new AirportFlights(vatsim.departure, vatsim.arrival);
  }
}

export class AirportDetailedResponse {
  @ApiProperty()
  icao: string;
  @ApiProperty()
  iata: Nullable<string>;
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
  @ApiProperty()
  metar: Nullable<string>;
  @ApiProperty()
  taf: Nullable<string>;
  @ApiProperty({ type: NetworksAirportFlights })
  stats: NetworksAirportFlights;

  constructor(
    airport: Airport,
    metar: Nullable<string>,
    taf: Nullable<string>,
    stats: Map<Network, NetworkAirportFlights>,
  ) {
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
    this.metar = assertNullable(metar);
    this.taf = assertNullable(taf);
    this.stats = new NetworksAirportFlights(
      stats.get(Network.IVAO)!,
      stats.get(Network.VATSIM)!,
    );
  }
}
