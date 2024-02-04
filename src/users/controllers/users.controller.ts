import { Authenticated, AuthenticatedUser } from '@/shared/utils/decorators';
import { BodyParserPipe } from '@/shared/pipes/body-parser.pipe';
import { User } from '@/users/domain/user.entity';
import { Profile } from '@/users/dtos/profile.dto';
import { ProfileOptionsDto } from '@/users/dtos/user-update.dto';
import { UsersService } from '@/users/services/users.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@Authenticated()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch('profile')
  @ApiOperation({ description: 'Update user profile' })
  @ApiNoContentResponse({ description: 'User profile updated' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfile(
    @Body(new BodyParserPipe(ProfileOptionsDto)) body: ProfileOptionsDto,
    @AuthenticatedUser() user: User,
  ) {
    await this.userService.updateProfile(user, body);
  }

  @Get('profile')
  @ApiOperation({ description: 'Get authenticated user profile' })
  @ApiOkResponse({ description: 'User profile', type: Profile })
  async getProfile(@AuthenticatedUser() user: User) {
    return new Profile(user);
  }
}
