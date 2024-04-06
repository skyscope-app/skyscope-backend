import { Type } from 'class-transformer';

export class VatSpyDataFir {
  icao: string;
  name: string;
  callsign_prefix: string;
  fir_boundary: string;
}

export class VatSpyDataBoundary {
  icao: string;
  latitude: number;
  longitude: number;
  division: string;
  region: string;
  points: Array<[number, number]>;
}

export class VatspyDataBoundaryMap {
  [key: string]: VatSpyDataBoundary;
}

export class VatSpyData {
  airac: string;
  name: string;
  @Type(() => VatSpyDataFir)
  firs: VatSpyDataFir[];
  @Type(() => VatspyDataBoundaryMap)
  boundaries: VatspyDataBoundaryMap;
}
