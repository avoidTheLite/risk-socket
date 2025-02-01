import {WebSocketServer } from 'ws';
import {Server} from 'http'

function createWebSocketServer(wsServer: Server) {
    const wss: WebSocketServer = new WebSocketServer({
        server: wsServer,
        // path: '/game'
    })
    
    wss.on('connection', (ws) => {
        ws.send('...connected to risk server')
        console.log('WebSocket connection opened')
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        })
        ws.on('message', (message) => {
            try {
                const parsedMessage = JSON.parse(message.toString());
                if (parsedMessage.action && parsedMessage.data) {
                    // TODO Run commands here
                } else {
                    ws.send(JSON.stringify({ error: 'Invalid message format' }));
                }
            } catch (err) {
                ws.send(JSON.stringify({ error: 'Unable to parse message' }));
            }
        });
        ws.on('close', () => {
            console.log('WebSocket connection closed');
        })        
    });
    return wss;
}

export default createWebSocketServer