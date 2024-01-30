import { AuthModule } from '@/auth/auth.module';
import { LoggerModule } from '@/logger/logger.module';
import { User } from '@/users/domain/user.entity';
import { FriendsController } from '@/users/friends.controller';
import { FriendsService } from '@/users/friends.service';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FriendsService]),
    LoggerModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, FriendsService],
  exports: [UsersService, FriendsService],
  controllers: [UsersController, FriendsController],
})
export class UsersModule {}
