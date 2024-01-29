import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty()
  @IsNumberString()
  @Length(6, 10)
  @IsOptional()
  ivaoId?: string;
  @ApiProperty()
  @IsNumberString()
  @Length(6, 10)
  @IsOptional()
  vatsimId?: string;
  @ApiProperty()
  @IsNumberString()
  @Length(6, 10)
  @IsOptional()
  posconId?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  simbriefId?: string;
}
