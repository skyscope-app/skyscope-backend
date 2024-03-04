import { LiveFlight } from '@/networks/dtos/live-flight.dto';
import { NetworksService } from '@/networks/services/networks.service';
import { getObjectRecursiveKeys } from '@/shared/utils/object';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'flexsearch';

@Injectable()
export class FlightsSearchService {
  constructor(private readonly networksService: NetworksService) {}

  private async loadFlightData() {
    const flights = await this.networksService.fetchCurrentLive();

    const fields = new Set(
      flights.flatMap((flight) => getObjectRecursiveKeys(flight)),
    );

    const doc = new Document({
      document: {
        id: 'id',
        field: [...fields],
        index: [...fields],
        store: [...fields],
      },
    });

    await Promise.all(flights.map((flight) => doc.addAsync(flight.id, flight)));

    return doc;
  }

  async findByParams(term: string) {
    const flights = await this.loadFlightData();

    const data = await flights.searchAsync({
      query: term,
      enrich: true,
    });

    return data.flatMap((data) => {
      return data.result.map((doc) => plainToInstance(LiveFlight, doc.doc));
    });
  }

  async findByID(flightId: string) {
    const flights = await this.loadFlightData();

    const data = await flights.searchAsync({
      enrich: true,
      query: flightId,
    });

    if (data.length === 0) {
      return;
    }

    const raw = data[0].result[0].doc;
    return plainToInstance(LiveFlight, raw);
  }
}
