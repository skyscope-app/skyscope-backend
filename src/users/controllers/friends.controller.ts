import { Authenticated, AuthenticatedUser } from '@/shared/utils/decorators';
import { User } from '@/users/domain/user.entity';
import { Profile } from '@/users/dtos/profile.dto';
import { FriendsService } from '@/users/services/friends.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BodyParserPipe } from '@/shared/pipes/body-parser.pipe';
import { AddFriendDto } from '@/users/dtos/add-friend.dto';

@Controller('friends')
@ApiTags('friends')
@Authenticated()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ description: 'List friends' })
  @ApiOkResponse({ type: [Profile] })
  async listFriends(@AuthenticatedUser() user: User) {
    const users = await this.friendsService.list(user.uid);
    return users.map((user) => new Profile(user));
  }

  @Post()
  @ApiOperation({ description: 'Add friend' })
  addFriend(
    @AuthenticatedUser() user: User,
    @Body(new BodyParserPipe(AddFriendDto)) body: AddFriendDto,
  ) {
    return this.friendsService.add(user.id, body);
  }

  @Delete(':friendId')
  @ApiOperation({ description: 'Remove friend' })
  removeFriend(
    @AuthenticatedUser() user: User,
    @Param('friendId') friendId: string,
  ) {
    return this.friendsService.remove(user.id, friendId);
  }
}
