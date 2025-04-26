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
        game.lastEngagement = engagement;
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
        game.lastEngagement = engagement;
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
        game.lastEngagement = engagement;
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
        game.lastEngagement = engagement;
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
        game.lastEngagement = engagement;
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
        game.lastEngagement = engagement;
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
        game.lastEngagement = engagement;
        game.turnTracker.phase = 'conquer';
        game.countries[engagement.attackingCountry].armies = 3;
        game.countries[engagement.attackingCountry].ownerID = 0;    
        game.countries[engagement.defendingCountry].armies = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        await expect(conquer(game, engagement)).rejects.toThrow(conquerError);
    })

    test('should throw an error if conquering from a different country than attacking', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 5,
            defendingCountry: 1,
            attackingTroopCount: 3,
            conquered: true
        }
        game.lastEngagement = {
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
        await expect(conquer(game, engagement)).rejects.toThrow(conquerError);
    })

    test('should throw an error if conquering with fewer armies than survived last engagmement', async () => {
        game = createTestGame(4);
        let engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            conquered: true
        }
        game.lastEngagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2,
            attackersLost: 1,
            defendersLost: 1,
            conquered: true
        }
        game.turnTracker.phase = 'conquer';
        game.countries[engagement.attackingCountry].armies = 1;
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
            conquered: true
        }
        game.lastEngagement = {
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
        game.countries[engagement.attackingCountry].color = "red";
        game.countries[engagement.defendingCountry].armies = 0;
        game.countries[engagement.defendingCountry].ownerID = 1;
        game.countries[engagement.defendingCountry].color = "blue";
        const response = await conquer(game, engagement);
        expect(response.data.engagement.conquered).toBe(false);
        expect(game.countries[engagement.defendingCountry].ownerID).toBe(0);
        expect(game.countries[engagement.defendingCountry].color).toBe(game.countries[engagement.attackingCountry].color);
        expect(game.turnTracker.phase).toBe('combat');
    })
   
})

describe('Conquer - defeating player', () => {
    let game: Game;
    let engagement: Engagement;

    beforeEach(() => {
        game = createTestGame(4);
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
        game.countries[0].ownerID = 0;
        game.countries[0].armies = 5;
        game.countries[1].ownerID = 1;
        game.countries[1].armies = 0;
        game.players[0].cards = [game.cardsAvailable[0]];
        game.players[1].cards = [game.cardsAvailable[1]];
        engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            conquered: true
        }
    })

    test('should transfer cards when defeating a player', async () => {
        const response = await conquer(game, engagement);
        expect(response.data.gameState.players[0].cards.length).toBe(2);
    })

    test('Should send defeated player message', async () => {
        const cardsTransferred: number = game.players[engagement.defendingCountry].cards.length;
        const response = await conquer(game, engagement);
        const defeatedMessage: string = `${game.players[engagement.attackingCountry].name} (Player ${game.players[engagement.attackingCountry].id}) has defeated ${game.players[engagement.defendingCountry].name} (Player ${game.players[engagement.defendingCountry].id}) and received ${cardsTransferred} cards. `;
        expect(response.data.message).toContain(defeatedMessage);
    })
})