import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@/http/http.service';
import { AiracStatus } from '@/navdata/entity/airac';
import { NavigraphSubscriptionValidResponse } from '@/navdata/dtos/navigraph.dto';
import * as moment from 'moment-timezone';
import { Integration } from '@/integrations/domain/integration';

@Injectable()
export class NavigraphService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  async validate(integration: Integration): Promise<AiracStatus> {
    try {
      const { data } = await this.httpService.get<
        NavigraphSubscriptionValidResponse[]
      >(`https://api.navigraph.com/v1/subscriptions/valid`, {
        Authorization: `Bearer ${integration.accessToken}`,
      });

      const validSubscription = data.find((sub) => {
        const activeAt = moment(sub.date_active);
        const expiryAt = moment(sub.date_expiry);

        return sub.type === 'fmsdata' && moment().isBetween(activeAt, expiryAt);
      });

      const status = validSubscription
        ? AiracStatus.CURRENT
        : AiracStatus.OUTDATED;

      return status;
    } catch (e) {
      this.logger.warn({
        message: `Error validating Navigraph subscription: ${e.message}`,
      });
      return AiracStatus.OUTDATED;
    }
  }
}
