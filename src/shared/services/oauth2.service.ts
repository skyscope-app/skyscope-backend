import { HttpService } from '@/http/http.service';
import { Injectable } from '@nestjs/common';

export interface OAuth2TokenExchangeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

@Injectable()
export class OAuth2Service {
  constructor(private readonly httpService: HttpService) {}

  async clientCredentials(
    tokenUrl: string,
    clientId: string,
    clientSecret: string,
  ) {
    const body = {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    };

    return this.httpService.post<OAuth2TokenExchangeResponse>(tokenUrl, body);
  }
}
