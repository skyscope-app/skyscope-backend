import { Airac, AiracStatus } from '@/navdata/entity/airac';
import { ApiProperty } from '@nestjs/swagger';

export class AiracResponse {
  @ApiProperty({ example: '2402' })
  cycle: string;
  @ApiProperty()
  from: Date;
  @ApiProperty()
  to: Date;
  @ApiProperty()
  status: AiracStatus;

  constructor(airac: Airac) {
    this.cycle = airac.cycle;
    this.from = new Date(airac.effectiveStartAt);
    this.to = new Date(airac.effectiveEndAt);
    this.status = airac.status;
  }
}
