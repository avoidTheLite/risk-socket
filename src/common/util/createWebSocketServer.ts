import {WebSocketServer } from 'ws';
import {Server} from 'http'
import wsMessageHandler from '../../game/wsMessageHandler';
import { WsRequest, WsActions, WsResponse, Game } from '../types/types';

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
        ws.on('message', async (message) => {
            let parsedMessage: WsRequest
            try{
                parsedMessage = JSON.parse(message.toString("utf-8"));
            } catch (err) {
                ws.send(JSON.stringify({ error: 'Unable to parse message' }));
                return
            }
            try {
                if (parsedMessage.data &&
                    typeof parsedMessage.data.action === 'string' &&
                    isValidAction(parsedMessage.data.action)
                ) {
                    const response: WsResponse = await wsMessageHandler(parsedMessage.data);
                    ws.send(JSON.stringify(response));
                } else {
                    const response: WsResponse = {
                        data: {
                            action: 'invalidAction',
                            message: 'Invalid message format or action not supported',
                            status: "failure"
                        }
                    }
                    ws.send(JSON.stringify(response));
                }
            } catch (err) {
                const response: WsResponse = {
                    data: {
                        action: parsedMessage.data.action,
                        message: 'There was an error procesing your request',
                        status: "failure"
                    }
                }
                ws.send(JSON.stringify(response));
            }
        });
        ws.on('close', () => {
            console.log('WebSocket connection closed');
        })        
    });
    return wss;
}

function isValidAction(action: WsActions) {
    return Object.values(WsActions).includes(action);
}

export default createWebSocketServer