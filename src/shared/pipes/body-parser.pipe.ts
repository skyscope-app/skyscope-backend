import { PipeTransform } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export class BodyParserPipe implements PipeTransform {
  constructor(private readonly entity: ClassConstructor<any>) {}

  transform(value: any): any {
    return plainToInstance(this.entity, value, { strategy: 'exposeAll' });
  }
}
