import { Module } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/domain/user.entity';
import { LoggerModule } from '@/logger/logger.module';
import { UsersController } from '@/users/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LoggerModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
