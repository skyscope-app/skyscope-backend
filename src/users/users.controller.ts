import { Body, Controller, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authenticated, AuthenticatedDomainUser } from '@/shared/decorators';
import { UpdateUserProfileDto } from '@/users/dtos/user-update.dto';
import { BodyParserPipe } from '@/shared/pipes/body-parser.pipe';
import { User } from '@/users/domain/user.entity';
import { UsersService } from '@/users/users.service';

@Controller('users')
@ApiTags('Users')
@Authenticated()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch('profile')
  @ApiOperation({ description: 'Update user profile' })
  async updateProfile(
    @Body(new BodyParserPipe(UpdateUserProfileDto)) body: UpdateUserProfileDto,
    @AuthenticatedDomainUser() user: User,
  ) {
    await this.userService.updateProfile(user, body);
  }
}
