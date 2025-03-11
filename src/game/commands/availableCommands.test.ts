import availableCommands from "./availableCommands";
import { Game, WsResponse } from "../../common/types/types";
import { describe, test, expect } from '@jest/globals';
import createTestGame from "../../common/util/test/createTestGame";
import assignCountries from "../services/assignCountries";
import assignArmies from "../services/assignArmies";
import { json } from "express";


describe('availableCommands - Unit tests', () => {
    
    // During Deploy Phase
    test('should return attack, move, and conquer options as unavilable', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.phase = 'deploy';

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.attack.available).toBe(false);
        expect(response.data.availableCommands.move.available).toBe(false);
        expect(response.data.availableCommands.conquer.available).toBe(false);
    })

    test('should return valid deploy options', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.players[playerID].armies = 5;
        game.phase = 'deploy';
        game.countries = assignCountries(game.players, game.countries);

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.deploy.available).toBe(true);
        expect(response.data.availableCommands.deploy.deployOptions?.length).toBe(11);
    })

    test('should return valid deploy options during play phase', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.players[playerID].armies = 5;
        game.phase = 'play';
        game.turnTracker.phase = 'deploy';
        game.countries = assignCountries(game.players, game.countries);

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.deploy.available).toBe(true);
        expect(response.data.availableCommands.deploy.deployOptions?.length).toBe(11);
    })

    test('should return valid attack options when player 0 has armies on alaska only', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.countries = assignCountries(game.players, game.countries);
        game.players = assignArmies(game.players, game.countries);
        game.countries[0].armies = 10;
        game.phase = 'play';
        game.turnTracker.phase = 'combat';

        let response: WsResponse = availableCommands(game, playerID);
        console.log(response.data.availableCommands.attack)
        expect(response.data.availableCommands.attack.available).toBe(true);
        expect(response.data.availableCommands.attack.attackOptions?.length).toBe(3);
    })

    test('should exclude country from attack option when player owns a connected country', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.countries = assignCountries(game.players, game.countries);
        game.players = assignArmies(game.players, game.countries);
        game.countries[0].ownerID = 0;
        game.countries[0].armies = 10;
        game.countries[1].armies = 10;
        game.countries[31].ownerID = 0;
        game.phase = 'play';
        game.turnTracker.phase = 'combat';

        let response: WsResponse = availableCommands(game, playerID);
        console.log(response.data.availableCommands.attack)
        expect(response.data.availableCommands.attack.available).toBe(true);
        expect(response.data.availableCommands.attack.attackOptions?.length).toBe(2);
    })

    test('should return the valid conquer option when available', () => {
        let game: Game = createTestGame(4);
        let playerID: number = 0;
        game.countries = assignCountries(game.players, game.countries);
        game.players = assignArmies(game.players, game.countries);
        game.countries[0].ownerID = 0;
        game.countries[0].armies = 10;
        game.countries[1].armies = 0;
        game.phase = 'play';
        game.turnTracker.phase = 'conquer';
        game.lastEngagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 1,
            attackersLost: 0,
            defendersLost: 1,
            conquered: true
        }

        let response: WsResponse = availableCommands(game, playerID);
        expect(response.data.availableCommands.conquer.available).toBe(true);
        expect(response.data.availableCommands.conquer.conquerOption.defendingCountry).toBe(1);
    })
})