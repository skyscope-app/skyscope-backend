import { AuthModule } from '@/auth/auth.module';
import { LoggerModule } from '@/logger/logger.module';
import { User } from '@/users/domain/user.entity';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LoggerModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
