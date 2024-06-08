import { ApiProperty } from '@nestjs/swagger';
import { Nullable } from '@/shared/utils/nullable';
import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddFriendDto {
  @ApiProperty({ type: String, nullable: true })
  @IsNumberString()
  @MaxLength(6)
  @MinLength(6)
  @IsOptional()
  ivaoId: Nullable<string>;
  @ApiProperty({ type: String, nullable: true })
  @IsNumberString()
  @MaxLength(8)
  @MinLength(6)
  @IsOptional()
  vatsimId: Nullable<string>;
  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  simbriefId: Nullable<string>;
}
