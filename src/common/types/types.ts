
export interface Player {
    id: string;
    name: string;
    color: string;
    armies: number;
    gameID: string;
}

export interface Globe {
    id: string;
    name: string;
    playerMax: number;
    countries: Country[];7
    continents: Continent[];
}

export interface Country {
    id: string;
    name: string;
    continent: string;
    ownerID: string;
    connectedTo: string[];
    armies: number;
}

export interface Continent {
    id: string;
    name: string;
    countries: string[];
}

export interface Game {
    id: string;
    name?: string;
    players: Player[];
    countries: Country[];
    continents: Continent[];
    globe: Globe;
    turn: number;
    phase: Phase;
    created_at?: string;
    updated_at?: string;
}

export type Phase = "deploy" | "play" | "end";

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