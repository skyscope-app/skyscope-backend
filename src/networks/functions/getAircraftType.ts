import * as helicopters from '@/networks/data/helicopters.json';
import { Aircraft, AircraftType } from '@/networks/dtos/live-flight.dto';

export const getAircraftType = (aircraft: Aircraft) => {
  if (helicopters.includes(aircraft.icao)) {
    return AircraftType.Helicopter;
  }

  if (aircraft.icao === 'CONC') {
    return AircraftType.Supersonic;
  }

  switch (aircraft.wakeTurbulence) {
    case 'H':
      return AircraftType.Heavy;
    case 'J':
      return AircraftType.Super;
    case 'M':
      return AircraftType.Medium;
    case 'L':
      return AircraftType.Light;
    default:
      return AircraftType.Unknown;
  }
};
