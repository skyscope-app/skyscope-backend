import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Authenticated, AuthenticatedUser } from '@/shared/utils/decorators';
import { User } from '@/users/domain/user.entity';
import {
  SaveSettingRequest,
  SettingResponse,
} from '@/settings/dto/settings.dto';
import { SettingsService } from '@/settings/services/settings.service';

@Controller('settings')
@ApiTags('Settings')
@Authenticated()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @ApiOperation({
    description:
      'Save a given setting to this user. Overwrite if setting already exist',
  })
  @ApiCreatedResponse({ description: 'Setting created' })
  async create(
    @AuthenticatedUser() user: User,
    @Body() setting: SaveSettingRequest,
  ) {
    await this.settingsService.save(user, setting);
  }

  @Get()
  @ApiOperation({ description: 'Get settings for current authenticated user' })
  @ApiOkResponse({ type: SettingResponse, description: 'List of settings' })
  async list(@AuthenticatedUser() user: User) {
    return await this.settingsService.list(user);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Removes a setting from current user' })
  @ApiOkResponse({ description: 'Setting removed' })
  async delete(@AuthenticatedUser() user: User, @Param('id') id: string) {
    await this.settingsService.delete(user, id);
  }
}
