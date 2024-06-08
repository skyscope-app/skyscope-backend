import { AuthModule } from '@/auth/auth.module';
import { CacheModule } from '@/cache/cache.module';
import { FilesModule } from '@/files/files.module';
import { LoggerModule } from '@/logger/logger.module';
import { FriendsController } from '@/users/controllers/friends.controller';
import { UsersController } from '@/users/controllers/users.controller';
import { User } from '@/users/domain/user.entity';
import { FriendsService } from '@/users/services/friends.service';
import { UsersService } from '@/users/services/users.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integration } from '@/integrations/domain/integration';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Integration]),
    LoggerModule,
    forwardRef(() => AuthModule),
    CacheModule,
    FilesModule,
  ],
  providers: [UsersService, FriendsService],
  exports: [UsersService, FriendsService],
  controllers: [UsersController, FriendsController],
})
export class UsersModule {}
