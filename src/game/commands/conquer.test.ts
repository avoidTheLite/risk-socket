import conquer from "./conquer";
import { Game, Engagement } from "../../common/types/types";
import { describe, test, expect } from '@jest/globals';
import createTestGame from "../../common/util/test/createTestGame";
import { conquerError } from "../../common/types/errors";

describe('conquer - Unit tests', () => {

    let game: Game;

    test('should throw an error if defender still has armies', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            attackersLost: 1,
            defendersLost: 1,
            conquered: true
        }
        game.countries[engagement.defendingCountry].armies = 5;
        await expect(conquer(game, engagement)).rejects.toThrow(conquerError);
    })

    test(' should throw an error if not in conquer phase', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            attackersLost: 1,
            defendersLost: 1,
            conquered: true
        }
        game.turnTracker.phase = 'combat';
        game.countries[engagement.attackingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].armies = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(conquer(game, engagement)).rejects.toThrow(conquerError);
    })

    test('should throw an error if conquered is not true', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            attackersLost: 1,
            defendersLost: 1,
            conquered: false
        }
        game.turnTracker.phase = 'conquer';
        game.countries[engagement.attackingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].armies = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(conquer(game, engagement)).rejects.toThrow(conquerError);
    })

    test('should throw an error if player is not the owner of the attacking country', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            attackersLost: 1,
            defendersLost: 1,
            conquered: true
        }
        game.turnTracker.phase = 'conquer';
        game.countries[engagement.attackingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 1;
        game.countries[engagement.defendingCountry].armies = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(conquer(game, engagement)).rejects.toThrow(conquerError);
    })

    test('should throw an error if player is the owner of the defending country', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            attackersLost: 1,
            defendersLost: 1,
            conquered: true
        }
        game.turnTracker.phase = 'conquer';
        game.countries[engagement.attackingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].armies = 0;
        game.countries[engagement.defendingCountry].ownerID = 0;
        await expect(conquer(game, engagement)).rejects.toThrow(conquerError);
    })

    test('should throw an error if countries are not connected', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 25,
            attackingTroopCount: 3,
            defendingTroopCount: 2,
            attackersLost: 1,
            defendersLost: 1,
            conquered: true
        }
        game.turnTracker.phase = 'conquer';
        game.countries[engagement.attackingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].armies = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(conquer(game, engagement)).rejects.toThrow(conquerError);
    })

    test('should throw an error if attacker leaves 0 armies behind', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2,
            attackersLost: 1,
            defendersLost: 1,
            conquered: true
        }
        game.turnTracker.phase = 'conquer';
        game.countries[engagement.attackingCountry].armies = 3;
        game.countries[engagement.attackingCountry].ownerID = 0;    
        game.countries[engagement.defendingCountry].armies = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(conquer(game, engagement)).rejects.toThrow(conquerError);
    })

    test('should successfully conquer a country', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2,
            attackersLost: 1,
            defendersLost: 1,
            conquered: true
        }
        game.turnTracker.phase = 'conquer';
        game.countries[engagement.attackingCountry].armies = 5;
        game.countries[engagement.attackingCountry].ownerID = 0;
        game.countries[engagement.defendingCountry].armies = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        const response = await conquer(game, engagement);
        expect(response.data.engagement.conquered).toBe(false);
        expect(game.countries[engagement.defendingCountry].ownerID).toBe(0);
        expect(game.turnTracker.phase).toBe('combat');
    })
})