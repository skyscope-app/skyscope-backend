import { HttpService } from '@/http/http.service';
import { Nullable } from '@/shared/utils/nullable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {
  private url = `https://aviationweather.gov/api/data/##product##?ids=##icao##`;

  constructor(private readonly httpService: HttpService) {}

  private async fetch(endpoint: string) {
    return this.httpService.get<string>(endpoint).then((r) => r.data);
  }

  async findMetar(icao: string): Promise<Nullable<string>> {
    const endpoint = this.url
      .replace('##product##', 'metar')
      .replace('##icao##', icao);

    const data = await this.fetch(endpoint);

    return data ? data.split('\n').join('') : null;
  }

  async findTaf(icao: string): Promise<Nullable<string>> {
    const endpoint = this.url
      .replace('##product##', 'taf')
      .replace('##icao##', icao);

    const data = await this.fetch(endpoint);

    return data ? data.split('\n').join('') : null;
  }
}
