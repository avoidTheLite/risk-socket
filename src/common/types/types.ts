
export class Player {
    id: number;
    name: string;
    color: string;
    armies: number;
    gameID?: string;

    constructor(id: number, name: string, color: string, armies: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.armies = armies;
    }
}

export class Globe {
    id: string;
    name: string;
    playerMax: number;
    countries: Country[];
    continents: Continent[];

    constructor(id: string, name: string, playerMax: number, countries: Country[], continents: Continent[]) {
        this.id = id;
        this.name = name;
        this.playerMax = playerMax;
        this.countries = countries;
        this.continents = continents;
    }
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

export class Game {
    saveName: string;
    id: string;
    players: Player[];
    countries: Country[];
    continents: Continent[];
    globeID: string;
    turn: number;
    phase: Phase;
    activePlayerIndex: number;
    name?: string;
    created_at?: string;
    updated_at?: string;

    constructor(
        saveName: string,
        id: string,
        players: Player[],
        countries: Country[],
        continents: Continent[],
        globeID: string,
        turn: number,
        phase: Phase,
        activePlayerIndex: number,
        name?: string,
        created_at?: string,
        updated_at?: string
    ){
        this.saveName = saveName;
        this.id = id;
        this.players = players;
        this.countries = countries;
        this.continents = continents;
        this.globeID = globeID;
        this.turn = turn;
        this.phase = phase;
        this.activePlayerIndex = activePlayerIndex;
        this.name = name;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
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
    attackingCountry: number;
    defendingCountry: number;
    attackingTroopCount: number;
    defendingTroopCount?: number;
    attackersLost?: number;
    defendersLost?: number;
    attackerRolls?: number[];
    defenderRolls?: number[];
}

export interface Deployment {
    countryID: number;
    armies: number;
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
    InvalidAction = 'invalidAction',
    Deploy = 'deploy',
    EndTurn = 'endTurn',
}
export interface WsRequest {
    data: {
        gameID?: string;
        action: WsActions;
        message: string;
        players?: Player[];
        globeID?: string;
        saveName?: string;
        playerID?: number;
        deployment?: Deployment;
        engagement?: Engagement;
    }
}

export interface WsResponse {
    data: {
        action: string;
        message: string;
        status: string;
        engagement?: Engagement;
        gameState?: Game;
    }
}