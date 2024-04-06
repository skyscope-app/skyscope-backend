export enum AiracStatus {
  CURRENT = 'CURRENT',
  OUTDATED = 'OUTDATED',
}

export class Airac {
  cycle: string;
  downloadAt: Date;
  effectiveEndAt: Date;
  effectiveStartAt: Date;
  file: string;
  status: AiracStatus;
}
