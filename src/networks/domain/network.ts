import { LiveFlight } from '@/networks/dtos/live-flight.dto';

export enum Network {
  IVAO = 'ivao',
  VATSIM = 'vatsim',
  POSCON = 'poscon',
}

export interface NetworkAirportFlights {
  departure: LiveFlight[];
  arrival: LiveFlight[];
}
