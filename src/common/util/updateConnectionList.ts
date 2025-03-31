import { WebSocket } from "ws";


export function removeConnection(
    gameConnections: Map<string, Set<WebSocket>>,
    socketToGame: Map<WebSocket, string>,
    ws: WebSocket,
) {
    const saveName = socketToGame.get(ws);
    if (saveName && gameConnections.has(saveName)) {
        gameConnections.get(saveName)!.delete(ws);
        if (gameConnections.get(saveName)!.size === 0) {
            gameConnections.delete(saveName);
        }
    }
    socketToGame.delete(ws);
}
export function updateConnectionList(
    gameConnections: Map<string, Set<WebSocket>>,
    socketToGame: Map<WebSocket, string>,
    ws: WebSocket,
    saveName: string
) {
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
  