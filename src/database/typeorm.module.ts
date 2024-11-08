import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/domain/user.entity';
import { Integration } from '@/integrations/domain/integration';

export const getDatabaseModule = (
  DB_HOST: string,
  DB_PORT: number,
  DB_USER: string,
  DB_PASS: string,
  DB_NAME: string,
  DB_POOL_SIZE: number,
  ENVIRONMENT: string,
) => {
  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    extra: {
      connectionLimit: DB_POOL_SIZE,
      ...(ENVIRONMENT === 'local'
        ? {}
        : { ssl: { rejectUnauthorized: false } }),
    },
    synchronize: false,
    entities: [User, Integration],
    logging: ENVIRONMENT === 'local',
  });
};
