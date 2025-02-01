import express, { Express } from 'express';
import router from './game/gameRouter';

const app: Express = express();
//TODO add logging and db middleware

app.use('/game', router);

export default app;