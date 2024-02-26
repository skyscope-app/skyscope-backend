export class Airport {
  icao: string;
  iata: string;
  name: string;
  lat: number;
  lng: number;

  constructor(
    icao: string,
    iata: string,
    name: string,
    lat: number,
    lng: number,
  ) {
    this.icao = icao;
    this.iata = iata;
    this.name = name;
    this.lat = lat;
    this.lng = lng;
  }
}