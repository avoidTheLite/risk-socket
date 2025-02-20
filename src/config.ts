import * as dotenv from 'dotenv';
import appConfig from './common/util/appconfig';

dotenv.config();
dotenv.config({ path: '../.env' });

const config = appConfig({
    env: {
        default: 'local',
        env: 'NODE_ENV',
      },
      serverPort: {
        default: 3001,
        env: 'PORT',
      },
      socketPort: {
        default: 8080,
        env: 'SOCKET_PORT',
      },
      logLevel: {
        default: 'debug',
        env: 'LOG_LEVEL',
      },
      dbHost: {
        default: 'localhost',
        env: 'DB_URL',
      },
      dbPort: {
        default: 5432,
        env: 'DB_PORT',
      },
      dbUsername: {
        default: 'postgres',
        env: 'DB_USER',
      },
      dbPassword: {
        default: 'password',
        env: 'DB_PASSWORD',
      },
      dbName: {
        env: 'DB_NAME',
        default: 'risk-socket',
      },
})

export default config;