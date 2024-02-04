import { ClassConstructor, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validate } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  POSTGRES_SSL_MODE: string;
}

export const EnvironmentConfiguration = getConfiguration(Configuration);
