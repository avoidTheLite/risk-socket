import {WebSocketServer, WebSocket } from 'ws';
import {Server} from 'http'
import wsMessageHandler from '../../game/wsMessageHandler';
import { WsRequest, WsActions, WsResponse, Game } from '../types/types';

function createWebSocketServer(wsServer: Server) {
    const wss: WebSocketServer = new WebSocketServer({
        server: wsServer,
        // path: '/game'
    })

    const gameConnections = new Map<string, Set<WebSocket>>();
    const socketToGame = new Map<WebSocket, string>();
    
    wss.on('connection', (ws: WebSocket) => {
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
            const saveName= parsedMessage.data?.saveName;
            if (saveName) {
                const currentSaveName = socketToGame.get(ws);
                if (currentSaveName !== saveName) {
                    console.log(`Socket switched from game ${currentSaveName || 'none'} → ${saveName}`);
                    if (currentSaveName && gameConnections.has(currentSaveName)) {
                        gameConnections.get(currentSaveName)!.delete(ws);
                        if (gameConnections.get(currentSaveName)!.size === 0) {
                            gameConnections.delete(currentSaveName);
                        }
                    }
                }
                if(!gameConnections.has(saveName)) {
                    gameConnections.set(saveName, new Set());
                }
                gameConnections.get(saveName)!.add(ws);
                socketToGame.set(ws, saveName);
                console.log(`Game ${saveName} has ${gameConnections.get(saveName)!.size} connections`)
            }

            try {
                if (parsedMessage.data &&
                    typeof parsedMessage.data.action === 'string' &&
                    isValidAction(parsedMessage.data.action)
                ) {
                    const response: WsResponse = await wsMessageHandler(parsedMessage.data);
                    if (response.data.status === 'success' && saveName){
                        gameConnections.get(saveName)!.forEach(connection => {
                            if (connection !== ws && connection.readyState === WebSocket.OPEN) {
                                connection.send(JSON.stringify(response));
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
            
            const saveName = socketToGame.get(ws);
            if (saveName && gameConnections.has(saveName)) {
                gameConnections.get(saveName)!.delete(ws);
                if (gameConnections.get(saveName)!.size === 0) {
                    gameConnections.delete(saveName);
                }
            }
            socketToGame.delete(ws);
            console.log('WebSocket connection closed');
        })        
    });
    return wss;
}

function isValidAction(action: WsActions) {
    return Object.values(WsActions).includes(action);
}

export default createWebSocketServer