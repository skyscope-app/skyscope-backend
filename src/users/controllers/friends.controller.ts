import { Authenticated, AuthenticatedUser } from '@/shared/decorators';
import { User } from '@/users/domain/user.entity';
import { Profile } from '@/users/dtos/profile.dto';
import { FriendsService } from '@/users/services/friends.service';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('friends')
@ApiTags('friends')
@Authenticated()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ description: 'List friends' })
  listFriends(@AuthenticatedUser() user: User) {
    return this.friendsService
      .list(user.id)
      .then((users) => users.map((user) => new Profile(user)));
  }

  @Post(':friendId')
  @ApiOperation({ description: 'Add friend' })
  addFriend(
    @AuthenticatedUser() user: User,
    @Param('friendId') friendId: string,
  ) {
    return this.friendsService.add(user.id, friendId);
  }
}
