import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProfileOptionsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}
