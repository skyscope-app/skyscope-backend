import { AuthService } from '@/auth/auth.service';
import { FirebaseStrategy } from '@/auth/firebase.strategy';
import { CacheModule } from '@/cache/cache.module';
import { ConfigurationsModule } from '@/configurations/configuration.module';
import { HttpModule } from '@/http/http.module';
import { LoggerModule } from '@/logger/logger.module';
import { UsersModule } from '@/users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    LoggerModule,
    ConfigurationsModule,
    CacheModule,
    HttpModule,
    forwardRef(() => UsersModule),
  ],
  providers: [FirebaseStrategy, AuthService],
  exports: [FirebaseStrategy, AuthService],
})
export class AuthModule {}
