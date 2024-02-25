import { IsNotEmpty, IsString } from 'class-validator';

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
}
