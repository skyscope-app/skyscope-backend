import { Authenticated, AuthenticatedUser } from '@/shared/utils/decorators';
import { User } from '@/users/domain/user.entity';
import { Profile } from '@/users/dtos/profile.dto';
import { FriendsService } from '@/users/services/friends.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BodyParserPipe } from '@/shared/pipes/body-parser.pipe';
import { ProfileOptionsDto } from '@/users/dtos/user-update.dto';

@Controller('friends')
@ApiTags('friends')
@Authenticated()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ description: 'List friends' })
  async listFriends(@AuthenticatedUser() user: User) {
    const users = await this.friendsService.list(user.uid);
    return users.map((user) => new Profile(user));
  }

  @Post()
  @ApiOperation({ description: 'Add friend' })
  addFriend(
    @AuthenticatedUser() user: User,
    @Body(new BodyParserPipe(ProfileOptionsDto)) body: ProfileOptionsDto,
  ) {
    return this.friendsService.add(user.id, body);
  }
}
