import { ClassConstructor, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, validate } from 'class-validator';
import { config } from 'dotenv';
import { name, version } from '../../package.json';

config();

export const getConfiguration = <T>(data: ClassConstructor<T>): T => {
  const object = plainToInstance<any, any>(data, process.env, {
    strategy: 'exposeAll',
  });
  object['APP_VERSION'] = version;
  object['APP_NAME'] = name;
  return object;
};

export const validateConfiguration = async <T>(
  data: ClassConstructor<T>,
): Promise<T> => {
  const object = getConfiguration<T>(data);
  const errors = await validate(object as any);

  if (errors.length > 0) {
    throw new Error(
      JSON.stringify(
        errors.map((error) => {
          delete error.target;
          return error;
        }),
      ),
    );
  }

  return object;
};

export class Configuration {
  @IsString()
  @IsNotEmpty()
  APP_VERSION: string;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_HOST: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_USER: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PORT: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_DATABASE: string;

  @IsString()
  @IsNotEmpty()
  ENVIRONMENT: string;

  @IsUrl()
  @IsNotEmpty()
  DISCORD_WEBHOOK_URL: string;

  @IsString()
  @IsNotEmpty()
  SERVICE_NAME: string;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNotEmpty()
  @IsString()
  REDIS_PORT: string;

  @IsNotEmpty()
  @IsString()
  REDIS_DB: string;

  @IsString()
  REDIS_USER: string;

  @IsString()
  REDIS_PASSWORD: string;

  get REDIS_URL() {
    return `redis://${this.REDIS_USER}:${this.REDIS_PASSWORD}@${this.REDIS_HOST}:${this.REDIS_PORT}/${this.REDIS_DB}`;
  }
}

export const EnvironmentConfiguration = getConfiguration(Configuration);
