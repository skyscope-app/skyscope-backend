export class Airport {
  icao: string;
  iata: string;
  name: string;
  lat: number;
  lng: number;

  constructor(obj: any) {
    this.icao = obj.icao;
    this.iata = obj.iata;
    this.name = obj.name;
    this.lat = Number(obj.lat);
    this.lng = Number(obj.lon);
  }
}
