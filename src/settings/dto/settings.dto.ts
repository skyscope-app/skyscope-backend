import { ApiProperty } from '@nestjs/swagger';

export class SettingResponse {
  @ApiProperty({ example: 'setting_value' })
  setting_id: string;
}

export class SaveSettingRequest {
  @ApiProperty({ example: 'setting_value' })
  setting_id: string;
}
