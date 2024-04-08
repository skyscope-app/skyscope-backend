import { HttpService } from '@/http/http.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SimbriefService {
  constructor(private readonly httpService: HttpService) {}

  async current(simbriefId: string) {
    try {
      const endpoint = `https://www.simbrief.com/api/xml.fetcher.php?username=${simbriefId}&json=1`;
      const r = await this.httpService.get(endpoint);
      return r.data;
    } catch (e) {
      if (
        e.response.data.fetch.status ===
        'Error: No flight plan on file for the specified user'
      ) {
        return null;
      }
      throw e;
    }
  }
}
