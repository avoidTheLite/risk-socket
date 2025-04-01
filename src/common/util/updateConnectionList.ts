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

export function assignPlayersToClients(
    playersToClient: Map<string, Map<number, WebSocket>>,
    clientToPlayers: Map<WebSocket, {saveName: string, playerIDs:number[]}>,
    ws: WebSocket,
    saveName: string,
    playerIDs: number[],
) {
    if (!playersToClient.has(saveName)) {
        playersToClient.set(saveName, new Map());
    }
    for (let i=0; i<playerIDs.length; i++) {
        playersToClient.get(saveName).set(playerIDs[i], ws);
    }
    clientToPlayers.set(ws, {saveName: saveName, playerIDs: playerIDs});

}

export function removePlayersFromClients(
    playersToClient: Map<string, Map<number, WebSocket>>,
    clientToPlayers: Map<WebSocket, {saveName: string, playerIDs:number[]}>,
    ws: WebSocket,
    saveName: string,
    playerIDs: number[],
) {
    for (let i=0; i<playerIDs.length; i++) {
        playersToClient.get(saveName).delete(playerIDs[i]);
    }
    const currentPlayersAssigned = clientToPlayers.get(ws).playerIDs;
    console.log(currentPlayersAssigned)
    let tempPlayersAssigned = [...currentPlayersAssigned];
    for (let i=0; i<currentPlayersAssigned.length; i++) {
        if (playerIDs.includes(currentPlayersAssigned[i])) {
            console.log(`i = ${i}, removing ${currentPlayersAssigned[i]}`)
            tempPlayersAssigned.splice(tempPlayersAssigned.indexOf(currentPlayersAssigned[i]), 1);
            console.log(`i = ${i}, tempPlayersAssigned ${tempPlayersAssigned[i]}`)
        }
    }
    console.log(tempPlayersAssigned)
    if (currentPlayersAssigned.length === 0) {
        clientToPlayers.delete(ws);
    } else {
        clientToPlayers.set(ws, {saveName: saveName, playerIDs: tempPlayersAssigned});
    }
}

export function checkAndAssignGameHost(
    gameHosts: Map<string, WebSocket>,
    ws: WebSocket,
    saveName: string
) {
    if (!gameHosts.has(saveName)) {
        gameHosts.set(saveName, ws);
    }
}