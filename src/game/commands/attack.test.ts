import attack from "./attack";
import { describe, test, expect, beforeEach } from '@jest/globals';
import createTestGame from "../../common/util/test/createTestGame";
import { Engagement, Game } from "../../common/types/types";
import { attackError } from "../../common/types/errors";


describe('attack', () => {
    let game: Game;
    beforeEach(() => {
        game = createTestGame(4);
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
})