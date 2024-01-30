import { AuthModule } from '@/auth/auth.module';
import { LoggerModule } from '@/logger/logger.module';
import { User } from '@/users/domain/user.entity';
import { FriendsController } from '@/users/controllers/friends.controller';
import { FriendsService } from '@/users/services/friends.service';
import { UsersController } from '@/users/controllers/users.controller';
import { UsersService } from '@/users/services/users.service';
import { forwardRef, Module } from '@nestjs/common';
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
