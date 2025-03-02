
export interface Player {
    id: number;
    name: string;
    color: string;
    armies?: number;
    gameID?: string;
}

export interface Globe {
    id: string;
    name: string;
    playerMax: number;
    countries: Country[];
    continents: Continent[];
}

export interface GlobeRecord {
    id: string;
    name: string;
    playerMax: number;
    countries: string;
    continents: string;
}

export interface Country {
    id: number;
    name: string;
    continent: string;
    connectedTo: number[];
    ownerID?: number;
    armies?: number;
}

export interface Continent {
    id: number;
    name: string;
    countries: number[];
    armies: number;
}

export interface Game {
    saveName: string;
    id: string;
    name?: string;
    players: Player[];
    countries: Country[];
    continents: Continent[];
    globeID: string;
    turn: number;
    phase: Phase;
    activePlayerIndex: number;
    created_at?: string;
    updated_at?: string;
}

export interface GameRecord {
    saveName: string;
    id: string;
    name?: string;
    players: string;
    countries: string;
    continents: string;
    globeID: string;
    turn: number;
    phase: Phase;
    activePlayerIndex: number;
    created_at?: string;
    updated_at?: string;
}

export type Phase = "deploy" | "play" | "end";

export type TurnPhase = "start" | "deploy" | "combat" | "move" | "card";

export interface Turn {
    phase: TurnPhase;
    earnedCard: boolean;
    armiesEarned: number;
}
export interface Engagement {
    attackingCountry: string;
    defendingCountry: string;
    attackingTroopCount: number;
    defendingTroopCount: number;
    attackersLost?: number;
    defendersLost?: number;
    attackerRolls?: number[];
    defenderRolls?: number[];
}

export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
}

export enum WsActions {
    NewGame = 'newGame',
    Echo = 'echo',
    InvalidAction = 'invalidAction'
    
}
export interface WsRequest {
    data: {
        gameID?: string;
        action: WsActions;
        message: string;
        players?: Player[];
        globeID?: string;
    }
}

export interface WsResponse {
    data: {
        action: string;
        message: string;
        status: string;
    }
}