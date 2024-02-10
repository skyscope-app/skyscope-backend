import { Injectable } from '@nestjs/common';
import { NetworkService } from '@/networks/domain/network-service';
import { LiveFlight } from '../dtos/live-flight.dto';

@Injectable()
export class PosconService implements NetworkService {
  fetchCurrentLive(): Promise<LiveFlight[]> {
    throw new Error('Method not implemented.');
  }
}
