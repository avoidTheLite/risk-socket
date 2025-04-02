import { WebSocket } from "ws";

class GameConnectionManager {
    private gameToConnections = new Map<string, Set<WebSocket>>();
    private socketToGame = new Map<WebSocket, string>();
    private gameHosts = new Map<string, WebSocket>();
    private playersToClient = new Map<string, Map<number, WebSocket>>();
    private clientToPlayers = new Map<WebSocket, {saveName: string, playerIDs: number[]}>();

    getConnections(
        saveName: string
    ): WebSocket[] {
        return [...this.gameToConnections.get(saveName) ?? []];
    }

    getGame(
        ws: WebSocket
    ): string | undefined {
        return this.socketToGame.get(ws);
    }
    updateConnection(
        ws: WebSocket,
        saveName: string
    ): void {
        const currentSaveName = this.socketToGame.get(ws);
        if (currentSaveName !== saveName) {
            console.log(`Socket switched from game ${currentSaveName || 'none'} → ${saveName}`);
            if (currentSaveName && this.gameToConnections.has(currentSaveName)) {
                this.gameToConnections.get(currentSaveName)!.delete(ws);
                if (this.gameToConnections.get(currentSaveName)!.size === 0) {
                    this.gameToConnections.delete(currentSaveName);
                }
            }
        }
        if(!this.gameToConnections.has(saveName)) {
            this.gameToConnections.set(saveName, new Set());
        }
        this.gameToConnections.get(saveName)!.add(ws);
        this.socketToGame.set(ws, saveName);
        console.log(`Game ${saveName} has ${this.gameToConnections.get(saveName)!.size} connections`)
    }

    removeConnection(
        ws: WebSocket,
    ): void {
        const saveName = this.socketToGame.get(ws);
        if (saveName && this.gameToConnections.has(saveName)) {
            this.gameToConnections.get(saveName)!.delete(ws);
            if (this.gameToConnections.get(saveName)!.size === 0) {
                this.gameToConnections.delete(saveName);
            }
        }
        this.socketToGame.delete(ws);
    }

    getHost(
        saveName: string
    ): WebSocket | undefined {
        return this.gameHosts.get(saveName);
    }
    assignGameHostIfNone(
        ws: WebSocket,
        saveName: string
    ): void {
        if (!this.gameHosts.has(saveName)) {
            this.gameHosts.set(saveName, ws);
        }
    }

    getPlayers(
        ws: WebSocket
    ): number[] | [] {
        return this.clientToPlayers.get(ws)?.playerIDs ?? [];
    }
    promoteNewHost(
        newHost: WebSocket,
        saveName: string
    ): void {
        this.gameHosts.delete(saveName);
        this.assignGameHostIfNone(newHost, saveName);
    }

    assignPlayersToClient(
        ws: WebSocket,
        saveName: string,
        playerIDs: number[],
    ): void {
        if (!this.playersToClient.has(saveName)) {
            this.playersToClient.set(saveName, new Map());
        }
        for (let i=0; i<playerIDs.length; i++) {
            this.playersToClient.get(saveName).set(playerIDs[i], ws);
        }
        const currentPlayersAssigned = this.clientToPlayers.get(ws)?.playerIDs ?? [];
        const combinedPlayersAssigned = [...currentPlayersAssigned, ...playerIDs];
        this.clientToPlayers.set(ws, {saveName: saveName, playerIDs: combinedPlayersAssigned});
    
    }
    removePlayersFromClient(
        ws: WebSocket,
        saveName: string,
        playerIDs: number[],
    ): void {
        for (let i=0; i<playerIDs.length; i++) {
            this.playersToClient.get(saveName).delete(playerIDs[i]);
        }
        const assignments = this.clientToPlayers.get(ws);
        if (!assignments) return;
        const currentPlayersAssigned = assignments.playerIDs;
        const tempPlayersAssigned = currentPlayersAssigned.filter((id) => !playerIDs.includes(id));
        if (tempPlayersAssigned.length === 0) {
            this.clientToPlayers.delete(ws);
        } else {
            this.clientToPlayers.set(ws, {saveName: saveName, playerIDs: tempPlayersAssigned});
        }
    }

    reassignPlayers(
        ws: WebSocket,
        saveName: string,
        playerIDs: number[]
    ): void {
        this.removePlayersFromClient(ws, saveName, playerIDs);
        this.assignPlayersToClient(ws, saveName, playerIDs);
        console.log(`Reassigned players ${playerIDs.join(', ')}`);
    
    }

    handleDisconnect(
        ws: WebSocket
    ): void {
        const saveName = this.socketToGame!.get(ws);
        if (!saveName) return;
        
        const assignments = this.clientToPlayers.get(ws);
        let playerIDs: number[] = assignments?.playerIDs ?? [];
        const connections = this.gameToConnections.get(saveName);
        const isHost = this.gameHosts.get(saveName) === ws;
        
        if (connections && connections.size > 0) {
            if (isHost) {
                const newHost: WebSocket = connections.values().next().value;
                this.promoteNewHost(newHost, saveName);
            };
            if (assignments) {
                this.reassignPlayers(this.gameHosts.get(saveName), saveName, playerIDs);
            }
        } else {
            this.removeConnection(ws);
            this.gameHosts.delete(saveName);
            if (assignments) {
                this.removePlayersFromClient(ws, saveName, playerIDs);
            }
        }
    }
    
}

export default GameConnectionManager