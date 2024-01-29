import { DataSource } from 'typeorm';

export const MigrateUp = async (
  DB_HOST: string,
  DB_USER: string,
  DB_PASS: string,
  DB_PORT: number,
  DB_NAME: string,
  ENVIRONMENT: string,
) => {
  const datasource = new DataSource({
    host: DB_HOST,
    type: 'postgres',
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    migrations: [`${__dirname}/migrations/*.js`],
    logging: ENVIRONMENT === 'local',
  });

  const ds = await datasource.initialize();

  await ds.runMigrations({
    transaction: 'all',
  });

  await ds.destroy();
};
