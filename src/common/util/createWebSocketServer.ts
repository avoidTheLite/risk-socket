import {WebSocketServer, WebSocket } from 'ws';
import {Server} from 'http'
import wsMessageHandler from '../../game/wsMessageHandler';
import { WsRequest, WsActions, WsResponse, Game, WsEvent } from '../types/types';
import GameConnectionManager from './GameConnectionManager';
import createSocketEventMessage from './createSocketEventMessage';


const manager = new GameConnectionManager();
function createWebSocketServer(wsServer: Server) {
    const wss: WebSocketServer = new WebSocketServer({
        server: wsServer,
        // path: '/game'
    })

    
    wss.on('connection', (ws: WebSocket) => {
        ws.send('...connected to risk server')
        console.log('WebSocket connection opened')
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        })
        ws.on('message', async (message) => {
            console.log('Incoming message from client:', message.toString());
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
                    const response: WsResponse = await wsMessageHandler(parsedMessage.data, ws);
                    const saveName: string = response.data.gameState?.saveName;
                    if (response.data.status === 'success' && saveName){
                        const socketEventMessage: WsEvent = createSocketEventMessage(response);
                        manager.getConnections(saveName).forEach(connection => {
                            if (connection !== ws && connection.readyState === WebSocket.OPEN) {
                                connection.send(JSON.stringify(socketEventMessage));
                            }
                        })
                    }
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
            } catch (error) {
                const response: WsResponse = {
                    data: {
                        action: parsedMessage.data.action,
                        message: `There was an error procesing your request ${error}`,
                        status: "failure"
                    }
                }
                ws.send(JSON.stringify(response));
            }
        });
        ws.on('close', () => {
            manager.handleDisconnect(ws);
            console.log('WebSocket connection closed');
        });        
    });
    return wss;
}

function isValidAction(action: WsActions) {
    return Object.values(WsActions).includes(action);
}

export { manager };
export default createWebSocketServer