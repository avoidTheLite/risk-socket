import { Game, Deployment } from "../../common/types/types";
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
        let deployment: Deployment = {
            targetCountry: 10,
            armies: 2,
        }
        
        
        game.countries[deployment.targetCountry].armies = 0
        game.countries[deployment.targetCountry].ownerID = 0
        const response = await deploy(game, deployment);
        expect(game.countries[deployment.targetCountry].armies).toBe(deployment.armies);
        expect(game.players[game.activePlayerIndex].armies).toBe(3);
        expect(response.data.status).toBe('success');
        expect(response.data.action).toBe('deploy');
        
    })

    test('should throw an error if player does not have enough armies', async () => {

        game.players[game.activePlayerIndex].armies = 1
        let deployment: Deployment = {
            targetCountry: 10,
            armies: 2,
        }
        game.countries[deployment.targetCountry].armies = 0
        await expect(deploy(game, deployment)).rejects.toThrow(deployError);
    })

    test('should throw an error if country does not belong to player', async () => {
        game.players[game.activePlayerIndex].armies = 5
        let deployment: Deployment = {
            targetCountry: 10,
            armies: 2,
        }
        game.countries[deployment.targetCountry].ownerID = 1
        await expect(deploy(game, deployment)).rejects.toThrow(deployError);
    })

    test('should throw an error if gamePhase is not deploy and turnPhase is not deploy', async () => {
        game.phase = 'play'
        game.turnTracker.phase = 'combat'
        game.players[game.activePlayerIndex].armies = 5
        let deployment: Deployment = {
            targetCountry: 10,
            armies: 2,
        }
        game.countries[deployment.targetCountry].ownerID = 0

        await expect(deploy(game, deployment)).rejects.toThrow(deployError);
    })

    test('should set turnPhase to combat if player has no more armies', async () => {
        game.phase = 'play'
        game.players[game.activePlayerIndex].armies = 2
        let deployment: Deployment = {
            targetCountry: 10,
            armies: 2,
        }
        game.countries[deployment.targetCountry].armies = 0
        game.countries[deployment.targetCountry].ownerID = 0
        const savedGame = await deploy(game, deployment);
        expect(game.turnTracker.phase).toBe('combat');
    })
})