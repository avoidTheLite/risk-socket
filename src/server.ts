import http from 'http';
import app from './app';
import config from './config';
import createWebSocketServer from './common/util/createWebSocketServer';

const wsPORT = config.get('socketPort');
const wsServer = http.createServer(app);
createWebSocketServer(wsServer);

wsServer.listen(wsPORT, '127.0.0.1', () => {
    console.log(`WebSocket server listening on port ${wsPORT}`);
})