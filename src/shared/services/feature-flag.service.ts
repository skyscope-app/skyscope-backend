import { Injectable } from '@nestjs/common';
import { remoteConfig } from 'firebase-admin';

@Injectable()
export class FeatureFlagService {
  async findById(id: string, defaultValue: boolean) {
    const data = await remoteConfig().getTemplate();

    const parameter = data.parameters[id];

    if (!parameter) {
      return defaultValue;
    }

    const value = parameter.defaultValue as any;

    if (value.useInAppDefault) {
      return defaultValue;
    }

    return value.value === 'true';
  }
}
