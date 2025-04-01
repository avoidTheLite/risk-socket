import { WebSocket } from "ws";


export function removeConnection(
    gameToConnections: Map<string, Set<WebSocket>>,
    socketToGame: Map<WebSocket, string>,
    ws: WebSocket,
) {
    const saveName = socketToGame.get(ws);
    if (saveName && gameToConnections.has(saveName)) {
        gameToConnections.get(saveName)!.delete(ws);
        if (gameToConnections.get(saveName)!.size === 0) {
            gameToConnections.delete(saveName);
        }
    }
    socketToGame.delete(ws);
}
export function updateConnectionList(
    gameToConnections: Map<string, Set<WebSocket>>,
    socketToGame: Map<WebSocket, string>,
    ws: WebSocket,
    saveName: string
) {
    const currentSaveName = socketToGame.get(ws);
    if (currentSaveName !== saveName) {
        console.log(`Socket switched from game ${currentSaveName || 'none'} → ${saveName}`);
        if (currentSaveName && gameToConnections.has(currentSaveName)) {
            gameToConnections.get(currentSaveName)!.delete(ws);
            if (gameToConnections.get(currentSaveName)!.size === 0) {
                gameToConnections.delete(currentSaveName);
            }
        }
    }
    if(!gameToConnections.has(saveName)) {
        gameToConnections.set(saveName, new Set());
    }
    gameToConnections.get(saveName)!.add(ws);
    socketToGame.set(ws, saveName);
    console.log(`Game ${saveName} has ${gameToConnections.get(saveName)!.size} connections`)
}

export function assignPlayersToClient(
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
    const currentPlayersAssigned = clientToPlayers.get(ws)?.playerIDs ?? [];
    const combinedPlayersAssigned = [...currentPlayersAssigned, ...playerIDs];
    clientToPlayers.set(ws, {saveName: saveName, playerIDs: combinedPlayersAssigned});

}

export function removePlayersFromClient(
    playersToClient: Map<string, Map<number, WebSocket>>,
    clientToPlayers: Map<WebSocket, {saveName: string, playerIDs:number[]}>,
    ws: WebSocket,
    saveName: string,
    playerIDs: number[],
) {
    for (let i=0; i<playerIDs.length; i++) {
        playersToClient.get(saveName).delete(playerIDs[i]);
    }
    const assignments = clientToPlayers.get(ws);
    if (!assignments) return;
    const currentPlayersAssigned = assignments.playerIDs;
    const tempPlayersAssigned = currentPlayersAssigned.filter((id) => !playerIDs.includes(id));
    if (tempPlayersAssigned.length === 0) {
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

function reassignPlayers(
    playersToClient: Map<string, Map<number, WebSocket>>,
    clientToPlayers: Map<WebSocket, {saveName: string, playerIDs:number[]}>,
    ws: WebSocket,
    saveName: string,
    playerIDs: number[]
) {
    removePlayersFromClient(playersToClient, clientToPlayers, ws, saveName, playerIDs);
    assignPlayersToClient(playersToClient, clientToPlayers, ws, saveName, playerIDs);
    console.log(`Reassigned players ${playerIDs.join(', ')}`);

}
function promoteNewHost(
    gameHosts: Map<string, WebSocket>,
    newHost: WebSocket,
    saveName: string
) {
    gameHosts.delete(saveName);
    checkAndAssignGameHost(gameHosts, newHost, saveName);
}

export function handleDisconnect(
    gameToConnections: Map<string, Set<WebSocket>>,
    socketToGame: Map<WebSocket, string>,
    playersToClient: Map<string, Map<number, WebSocket>>,
    clientToPlayers: Map<WebSocket, {saveName: string, playerIDs:number[]}>,
    gameHosts: Map<string, WebSocket>,
    ws: WebSocket
) {
    const saveName = socketToGame!.get(ws);
    if (!saveName) return;
    
    const assignments = clientToPlayers.get(ws);
    let playerIDs: number[] = assignments?.playerIDs ?? [];
    const connections = gameToConnections.get(saveName);
    const isHost = gameHosts.get(saveName) === ws;
    
    if (connections && connections.size > 0) {
        if (isHost) {
            const newHost: WebSocket = connections.values().next().value;
            promoteNewHost(gameHosts, newHost, saveName);
        };
        if (assignments) {
            reassignPlayers(playersToClient, clientToPlayers, gameHosts.get(saveName), saveName, playerIDs);
        }
    } else {
        removeConnection(gameToConnections, socketToGame, ws);
        gameHosts.delete(saveName);
        if (assignments) {
            removePlayersFromClient(playersToClient, clientToPlayers, ws, saveName, playerIDs);
        }
    }
}