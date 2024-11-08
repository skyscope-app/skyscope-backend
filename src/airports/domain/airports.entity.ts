import { AirportGate } from '@/airports/domain/airport_gate';
import { AirportRunway } from '@/airports/domain/airport_runway';
import { NavigraphAirport } from '@/navigraph/entities/navigraph_airport.entity';
import { Nullable } from '@/shared/utils/nullable';

export class Airport {
  public readonly icao: string;
  public readonly iata: Nullable<string>;
  public readonly name: string;
  public readonly latitude: number;
  public readonly longitude: number;
  public readonly elevation: number;
  public readonly transitionAltitude: number;
  public readonly transitionLevel: Nullable<number>;
  public readonly gates: AirportGate[];
  public readonly runways: AirportRunway[];

  constructor(airport: Airport) {
    this.icao = airport.icao;
    this.iata = airport.iata;
    this.name = airport.name;
    this.latitude = airport.latitude;
    this.longitude = airport.longitude;
    this.elevation = airport.elevation;
    this.gates = airport.gates;
    this.transitionAltitude = airport.transitionAltitude;
    this.transitionLevel = airport.transitionLevel;
    this.runways = airport.runways;
  }

  static fromNavigraph(navigraphAirport: NavigraphAirport) {
    return new Airport({
      icao: navigraphAirport.icao,
      iata: navigraphAirport.iata,
      name: navigraphAirport.name,
      latitude: navigraphAirport.latitude,
      longitude: navigraphAirport.longitude,
      elevation: navigraphAirport.elevation,
      transitionAltitude: navigraphAirport.transitionAltitude,
      transitionLevel: navigraphAirport.transitionLevel,
      gates: navigraphAirport.gates?.map(AirportGate.fromNavigraph) ?? [],
      runways: navigraphAirport.runways?.map(AirportRunway.fromNavigraph) ?? [],
    });
  }
}
