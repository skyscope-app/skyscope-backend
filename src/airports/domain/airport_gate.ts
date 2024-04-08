import { NavigraphAirportGate } from '@/navigraph/entities/navigraph_airport_gate.entity';

export class AirportGate {
  public readonly identifier: string;
  public readonly latitude: number;
  public readonly longitude: number;

  constructor(gate: AirportGate) {
    this.identifier = gate.identifier;
    this.latitude = gate.latitude;
    this.longitude = gate.longitude;
  }

  static fromNavigraph(gate: NavigraphAirportGate) {
    return new AirportGate({
      identifier: gate.gateIdentifier,
      latitude: gate.latitude,
      longitude: gate.longitude,
    });
  }
}
