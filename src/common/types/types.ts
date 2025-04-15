
export class Player {
    id: number;
    name: string;
    color: string;
    armies: number;
    gameID?: string;
    cards?: Card[];

    constructor(id: number, name: string, color: string, armies: number, cards?: Card[]) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.armies = armies;
        this.cards = cards;
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
    color?: string;
    armies?: number;
}

export interface Card {
    id: number;
    name: string;
    symbol: "infantry" | "cavalry" | "artillery" | "wildcard";
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
    turnTracker: TurnTracker;
    phase: Phase;
    activePlayerIndex: number;
    cardsAvailable: Card[];
    matches?: number;
    name?: string;
    created_at?: string;
    updated_at?: string;
    lastEngagement?: Engagement;

    constructor(
        saveName: string,
        id: string,
        players: Player[],
        countries: Country[],
        continents: Continent[],
        globeID: string,
        turn: number,
        turnTracker: TurnTracker,
        phase: Phase,
        activePlayerIndex: number,
        cardsAvailable: Card[],
        matches?: number,
        name?: string,
        lastEngagement?: Engagement
    ){
        this.saveName = saveName;
        this.id = id;
        this.players = players;
        this.countries = countries;
        this.continents = continents;
        this.globeID = globeID;
        this.turn = turn;
        this.turnTracker = turnTracker;
        this.phase = phase;
        this.activePlayerIndex = activePlayerIndex;
        this.cardsAvailable = cardsAvailable;
        this.matches = matches;
        this.name = name;
        this.lastEngagement = lastEngagement;

    }
}

export interface GameSlots {
    saveName: string;
    playerSlots: number[];
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
    turnTracker: string;
    phase: Phase;
    activePlayerIndex: number;
    cardsAvailable: string;
    matches: number;
    created_at?: string;
    updated_at?: string;
    lastEngagement?: string;
}

export type Phase = "deploy" | "play" | "end";

export type TurnPhase = "start" | "deploy" | "combat" | "conquer" | "move" | "end";

export interface TurnTracker {
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
    conquered?: boolean;
}

export interface Deployment {
    targetCountry: number;
    armies: number;
}

export interface Movement {
    targetCountry: number;
    sourceCountry: number;
    armies: number;
}

export interface AvailableCommand {
    action: WsActions;
    playerID: number; 
    available: boolean;
    deployOptions?: Deployment[];
    moveOptions?: Movement[];
    attackOptions?: Engagement[];
    conquerOption?: Engagement;
    cardMatchOptions?: Card[][];
}

export interface AvailableCommands {
    deploy: AvailableCommand;
    move: AvailableCommand;
    attack: AvailableCommand;
    conquer: AvailableCommand;
    cardMatch: AvailableCommand;
}

export interface GameOptions {
    randomAssignment?: boolean;
    neutralArmies?: boolean;
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
    Attack = 'attack',
    CardMatch = 'cardMatch',
    Conquer = 'conquer',
    Move = 'move',
    AvailableCommands = 'availableCommands',
    OpenGame = 'openGame',
    ViewOpenGames = 'viewOpenGames',
    JoinGame = 'joinGame',
}
export interface WsRequest {
    type?: 'request';
    data: {
        gameID?: string;
        action: WsActions;
        message: string;
        players?: Player[];
        globeID?: string;
        saveName?: string;
        playerID?: number;
        deployment?: Deployment;
        movement?: Movement;
        engagement?: Engagement;
        gameOptions?: GameOptions;
        cards?: Card[];
        playerSlots?: number[];
    }
}

export interface WsResponse {
    type?: 'response';
    data: {
        action: string;
        message: string;
        status: string;
        engagement?: Engagement;
        movement?: Movement;
        deployment?: Deployment;
        gameState?: Game;
        gameOptions?: GameOptions;
        cards?: Card[];
        availableCommands?: AvailableCommands;
        gameSlots?: GameSlots[];
    }
}

export interface WsEvent {
    type: 'event',
    data: {
        action: string;
        message: string;
        engagement?: Engagement;
        movement?: Movement;
        deployment?: Deployment;
        gameState: Game;
    }
}