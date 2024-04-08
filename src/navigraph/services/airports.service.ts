import { NavigraphAirport } from '@/navigraph/entities/airport.entity';
import { BaseService } from '@/navigraph/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';

@Injectable()
export class NavigraphAirportsService extends BaseService {
  constructor(
    @InjectDataSource('current')
    currentDataSource: DataSource,
    @InjectDataSource('outdated')
    outdatedDataSource: DataSource,
    clsService: ClsService,
  ) {
    super(currentDataSource, outdatedDataSource, clsService);
  }

  async findAllAsMap(): Promise<Map<string, NavigraphAirport>> {
    const airports = await this.getRepository(NavigraphAirport).find();

    return new Map(airports.map((airport) => [airport.icao, airport]));
  }
}
