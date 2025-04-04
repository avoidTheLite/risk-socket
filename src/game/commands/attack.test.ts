import { default as attack, combatResult } from "./attack";
import { describe, test, expect, beforeEach } from '@jest/globals';
import createTestGame from "../../common/util/test/createTestGame";
import { Engagement, Game, WsResponse } from "../../common/types/types";
import { attackError } from "../../common/types/errors";


describe('attack - Unit tests', () => {
    let game: Game;
    beforeEach(() => {
        game = createTestGame(4);
    })

    test('Combat result applied correctly', () => {
        game.phase = 'play';
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2,
            attackersLost: 1,
            defendersLost: 1
        }
        game.countries[engagement.attackingCountry].armies = 5
        game.countries[engagement.defendingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        game = combatResult(game, engagement);
        expect(game.countries[engagement.attackingCountry].armies).toBe(4);
        expect(game.countries[engagement.defendingCountry].armies).toBe(4);
    })

    test('should throw an error if not in play phase', async () => {
        game.phase = 'deploy';
        const engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2
        }
        game.countries[engagement.attackingCountry].armies = 5
        game.countries[engagement.defendingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(attack(game, engagement)).rejects.toThrow(attackError);
    })

    test('should throw an error if not in combat phase', async () => {
        game.phase = 'play';
        game.turnTracker.phase = 'deploy';
        const engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2
        }
        game.countries[engagement.attackingCountry].armies = 5
        game.countries[engagement.defendingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(attack(game, engagement)).rejects.toThrow(attackError);
    })
    test('should throw an error if not enough armies to attack', async () => {
        game.phase = 'play';
        const engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2
        }
        game.countries[engagement.attackingCountry].armies = 2
        game.countries[engagement.defendingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(attack(game, engagement)).rejects.toThrow(attackError);
    })

    test('should throw an error if player is not the owner of the attacking country', async () => {
        game.phase = 'play';
        const engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2
        }
        game.countries[engagement.attackingCountry].armies = 5
        game.countries[engagement.defendingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 1;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(attack(game, engagement)).rejects.toThrow(attackError);
    })

    test('should throw an error if player is the owner of the defending country', async () => {
        game.phase = 'play';
        const engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2
        }
        game.countries[engagement.attackingCountry].armies = 5
        game.countries[engagement.defendingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 0;
        await expect(attack(game, engagement)).rejects.toThrow(attackError);
    })

    test('should throw an error if countries are not connected', async () => {
        game.phase = 'play';
        const engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 2,
            attackingTroopCount: 3,
            defendingTroopCount: 2
        }
        game.countries[engagement.attackingCountry].armies = 5
        game.countries[engagement.defendingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(attack(game, engagement)).rejects.toThrow(attackError);
    })
})

describe('attack - Integration tests', () => {
    let game: Game;
    beforeEach(() => {
        game = createTestGame(4);
    })

    test('Attack works and returns a valid response object with 2 armies lost', async () => {
        game.phase = 'play';
        game.turnTracker.phase = 'combat';
        const engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2
        }
        game.countries[engagement.attackingCountry].armies = 5
        game.countries[engagement.defendingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;

        const totalStartingArmies = game.countries[engagement.attackingCountry].armies + game.countries[engagement.defendingCountry].armies
        const response = await attack(game, engagement);
        const totalEndingArmies = response.data.gameState.countries[engagement.attackingCountry].armies + response.data.gameState.countries[engagement.defendingCountry].armies
        expect(totalEndingArmies).toBe(totalStartingArmies - 2);
        expect(response.data.engagement).toEqual(engagement)
    })

    test('conquered is set to true if defending country is conquered', async () => {
        game.phase = 'play';
        game.turnTracker.phase = 'combat';
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 1
        }
        game.countries[engagement.attackingCountry].armies = 15
        game.countries[engagement.defendingCountry].armies = 1;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        while (game.countries[engagement.defendingCountry].armies > 0) {
            const response = await attack(game, engagement);
            console.log(response.data.engagement)
            game = response.data.gameState;
        }
        expect(game.countries[engagement.defendingCountry].armies).toBe(0);
        expect(engagement.conquered).toBe(true);

    });

    test('After defeating country, attack is disabled if conquer step has not occurred', async () => {
        game.phase = 'play';
        game.turnTracker.phase = 'combat';
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 1
        }
        game.countries[engagement.attackingCountry].armies = 10
        game.countries[engagement.defendingCountry].armies = 1;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        while (game.countries[engagement.defendingCountry].armies > 0) {
            const response = await attack(game, engagement);
            game = response.data.gameState;
        }
        await expect(attack(game, engagement)).rejects.toThrow(attackError);
    });

    test('should send victory message after winning the game', async () => {
        const victoryMessage = "Test Justin (Player 0) has won the game after conquering Alberta!"
        let response: WsResponse
        game.phase = 'play';
        game.turnTracker.phase = 'combat';
        const engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 1
        }
        for (let i = 2; i < game.countries.length; i++) {
            game.countries[i].ownerID = 0;
            game.countries[i].armies = 1;
        }
        game.countries[engagement.attackingCountry].armies = 10
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        game.countries[engagement.defendingCountry].armies = 1;
        
        while (game.countries[engagement.defendingCountry].armies > 0) {
            response = await attack(game, engagement);
        }
        expect(response.data.message).toBe(victoryMessage);
        expect(response.data.gameState.phase).toBe('end');
    })
    
})