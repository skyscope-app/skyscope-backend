import { AuthService } from '@/auth/auth.service';
import { FirebaseStrategy } from '@/auth/firebase.strategy';
import { CacheModule } from '@/cache/cache.module';
import { HttpModule } from '@/http/http.module';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigurationsModule } from '@/configurations/configuration.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    PassportModule,
    LoggerModule,
    ConfigurationsModule,
    CacheModule,
    HttpModule,
    UsersModule,
  ],
  providers: [FirebaseStrategy, AuthService],
  exports: [FirebaseStrategy, AuthService],
})
export class AuthModule {}
