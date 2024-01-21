import { Injectable, Logger } from '@nestjs/common';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import redact from 'redact-object';
import { v4 } from 'uuid';

@Injectable()
export class HttpService {
  public readonly axios: AxiosInstance;

  private redactedKeys: string[] = [
    'authorization',
    'paymentMethod',
    'X-Gateway-API-Key-Name',
    'X-Gateway-Account',
    'X-Gateway-API-Key',
    'merchantPassword',
    'previousOrderId',
    'customer-vault-id',
    'api-key',
    'bearer',
  ];

  constructor(private logger: Logger) {
    this.axios = axios.create({});

    this.axios.interceptors.request.use(
      this.onRequest.bind(this),
      this.onRequestError.bind(this),
    );

    this.axios.interceptors.response.use(
      this.onResponse.bind(this),
      this.onResponseError.bind(this),
    );
  }

  private redactData(data: Record<string, any>) {
    let toRedact = data;

    try {
      toRedact = JSON.parse(JSON.stringify(data));
    } catch {}

    const capitalizeFirstLetter = (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    try {
      const keys = this.redactedKeys
        .map((key) => [
          key.toUpperCase(),
          key.toLowerCase(),
          capitalizeFirstLetter(key),
          key,
        ])
        .flatMap((k) => k);

      return redact(toRedact, keys);
    } catch {
      return {};
    }
  }

  onRequest(config: InternalAxiosRequestConfig) {
    const requestId = v4();
    const requestTime = Date.now();

    config.headers['requestTime'] = requestTime;
    config.headers['requestId'] = requestId;

    const message = {
      headers: this.redactData(config.headers),
      url: config.url,
      body: this.redactData(config.data),
      method: config.method?.toUpperCase(),
      type: 'axios.client.on.request',
      requestId,
      requestTime: new Date(requestTime).toISOString(),
    };

    this.logger.log(message, 'HttpClient');

    return config;
  }

  onRequestError(error: AxiosError) {
    const requestTime = Number(error.config!.headers['requestTime']);
    const processingTime = Date.now() - requestTime;
    const requestId = error.config!.headers['requestId'];

    const message = {
      headers: this.redactData(error.config?.headers ?? {}),
      url: error.config?.url,
      body: this.redactData(error.config?.data),
      method: error.config?.method?.toUpperCase(),
      type: 'axios.client.on.request.error',
      processingTime,
      requestTime: new Date(requestTime).toISOString(),
      requestId,
      stack: error ? error.stack : 'undefined',
    };

    this.logger.error(message, error.stack, 'HttpClient');

    return Promise.reject(error);
  }

  onResponse(response: AxiosResponse) {
    const requestTime = Number(response.config!.headers['requestTime']);
    const processingTime = Date.now() - requestTime;
    const requestId = response.config.headers['requestId'];

    const message = {
      headers: this.redactData(response.config.headers ?? {}),
      url: response.config.url,
      requestBody: this.redactData(response.request.data),
      responseBody: this.redactData(response.data),
      method: response.config.method?.toUpperCase(),
      type: 'axios.client.on.response',
      processingTime,
      requestTime: new Date(requestTime).toISOString(),
      status: response.status,
      requestId,
    };

    this.logger.log(message, 'HttpClient');

    return response;
  }

  onResponseError(error: AxiosError) {
    const response = error.response as AxiosResponse;
    const requestTime = Number(error.config!.headers['requestTime']);
    const processingTime = Date.now() - requestTime;
    const requestId = error.config?.headers['requestId'];

    const message = {
      headers: this.redactData(error.config?.headers ?? {}),
      url: error.config?.url,
      responseBody: this.redactData(response?.data),
      method: error.config?.method?.toUpperCase(),
      type: 'axios.client.on.response.error',
      processingTime,
      requestTime,
      status: response?.status,
      requestId,
      message: error ? error.message : 'undefined',
      stack: error ? error.stack : 'undefined',
    };

    this.logger.error(message, error.stack, 'HttpClient');

    return Promise.reject(error);
  }

  post<T = any>(endpoint: string, body: any, headers?: object) {
    return this.axios.post<T>(endpoint, body, { headers });
  }

  get<T = any>(endpoint: string, headers?: object) {
    return this.axios.get<T>(endpoint, { headers });
  }
}
