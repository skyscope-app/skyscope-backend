import { HttpModule } from '@/http/http.module';
import { WeatherService } from '@/weather/services/weather.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
