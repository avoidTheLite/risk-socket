import { Game, Country } from "../../common/types/types";
import { deployError } from "../../common/types/errors";
import deploy from "./deploy";
import { describe, test, expect, beforeEach } from '@jest/globals';
import createTestGame from "../../common/util/test/createTestGame";



describe('deploy', () => {
    let game: Game;
    beforeEach(() => {
        game = createTestGame(4);
    });
    test('should deploy armies to a country', async () => {

        game.players[game.activePlayerIndex].armies = 5
        // const playerArmies = game.players[game.activePlayerIndex].armies
        let armiesDeployed = 2;
        let countryID = 10;
        game.countries[countryID].armies = 0
        game.countries[countryID].ownerID = 0
        const savedGame = await deploy(game, countryID, armiesDeployed);
        expect(game.countries[countryID].armies).toBe(armiesDeployed);
        expect(game.players[game.activePlayerIndex].armies).toBe(3);
        
    })

    test('should throw an error if player does not have enough armies', async () => {

        const playerArmies = game.players[game.activePlayerIndex].armies
        let armiesDeployed = 2;
        let countryID = 10;
        game.countries[countryID].armies = 0
        await expect(deploy(game, countryID, armiesDeployed)).rejects.toThrow(deployError);
    })

    test('should throw an error if country does not belong to player', async () => {
        game.players[game.activePlayerIndex].armies = 5
        let armiesDeployed = 2;
        let countryID = 10;
        game.countries[countryID].ownerID = 1
        await expect(deploy(game, countryID, armiesDeployed)).rejects.toThrow(deployError);
    })

    test('should throw an error if gamePhase is not deploy and turnPhase is not deploy', async () => {
        game.phase = 'play'
        game.turnTracker.phase = 'combat'
        game.players[game.activePlayerIndex].armies = 5
        let armiesDeployed = 2;
        let countryID = 10;
        game.countries[countryID].ownerID = 0

        await expect(deploy(game, countryID, armiesDeployed)).rejects.toThrow(deployError);
    })
})