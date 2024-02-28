import {
  Integration,
  IntegrationProviders,
} from '@/integrations/domain/integration';
import { User } from '@/users/domain/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateIntegrationDTO {
  @ApiProperty({ enum: ['navigraph'] })
  @IsEnum(IntegrationProviders)
  @IsNotEmpty()
  provider: IntegrationProviders;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  providerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  expiresIn: number;

  toDomain(user: User) {
    return new Integration(
      this.provider,
      this.providerId,
      user,
      this.accessToken,
      this.refreshToken,
      this.expiresIn,
    );
  }
}
