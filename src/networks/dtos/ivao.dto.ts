export interface IVAOResponse {
  clients: {
    pilots: IvaoPilot[];
  };
}

export interface IvaoPilot {
  time: number;
  id: number;
  userId: number;
  callsign: string;
  serverId: string;
  softwareTypeId: string;
  softwareVersion: string;
  rating: number;
  createdAt: string;
  lastTrack?: Track;
  flightPlan: FlightPlan;
  pilotSession: PilotSession;
}

export interface Track {
  altitude: number;
  altitudeDifference: number;
  arrivalDistance: number;
  departureDistance: number;
  groundSpeed: number;
  heading: number;
  latitude: number;
  longitude: number;
  onGround: boolean;
  state: string;
  timestamp: string;
  transponder: number;
  transponderMode: string;
  time: number;
}

export interface FlightPlan {
  id: number;
  revision: number;
  aircraftId: string;
  aircraftNumber: number;
  departureId: string;
  arrivalId: string;
  alternativeId: any;
  alternative2Id: any;
  route: string;
  remarks: string;
  speed: string;
  level: string;
  flightRules: string;
  flightType: string;
  eet: number;
  endurance: number;
  departureTime: number;
  actualDepartureTime: any;
  peopleOnBoard: number;
  createdAt: string;
  departure_id: string;
  arrival_id: string;
  alternative_id: any;
  alternative2_id: any;
  aircraftEquipments: string;
  aircraftTransponderTypes: string;
  aircraft: Aircraft;
}

export interface Aircraft {
  icaoCode: string;
  model: string;
  wakeTurbulence: string;
  isMilitary: number;
  description: string;
}

export interface PilotSession {
  simulatorId: string;
}
