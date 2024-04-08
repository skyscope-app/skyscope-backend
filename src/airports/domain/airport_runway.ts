import { NavigraphAirportRunway } from '@/navigraph/entities/navigraph_airport_runway.entity';
import { Nullable } from '@/shared/utils/nullable';

export class AirportRunway {
  public readonly identifier: string;
  public readonly latitude: number;
  public readonly longitude: number;
  public readonly gradient: number;
  public readonly magneticBearing: number;
  public readonly trueBearing: number;
  public readonly elevation: number;
  public readonly length: number;
  public readonly width: number;
  public readonly ilsCategory: Nullable<string>;

  constructor(airport: AirportRunway) {
    this.identifier = airport.identifier;
    this.latitude = airport.latitude;
    this.longitude = airport.longitude;
    this.gradient = airport.gradient;
    this.magneticBearing = airport.magneticBearing;
    this.trueBearing = airport.trueBearing;
    this.elevation = airport.elevation;
    this.length = airport.length;
    this.width = airport.width;
    this.ilsCategory = airport.ilsCategory;
  }

  static fromNavigraph(runway: NavigraphAirportRunway) {
    return new AirportRunway({
      identifier: runway.identifier,
      latitude: runway.latitude,
      longitude: runway.longitude,
      gradient: runway.gradient,
      magneticBearing: runway.magneticBearing,
      trueBearing: runway.trueBearing,
      elevation: runway.elevation,
      length: runway.length,
      width: runway.width,
      ilsCategory: runway.llzMlsGlsCategory,
    });
  }
}
