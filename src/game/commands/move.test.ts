import move from "./move";
import { Game, Movement, WsResponse } from "../../common/types/types";
import { moveError } from "../../common/types/errors";
import createTestGame from "../../common/util/test/createTestGame";
import { describe, test, expect } from '@jest/globals';

describe('Move - unit tests', () => {

    test('should throw error if player is not the owner of both countries', async () => {
        let game = createTestGame(4);
        let movement: Movement = {
            sourceCountry: 0,
            targetCountry: 1,
            armies: 1
        }
        game.phase = 'play';
        game.countries[movement.sourceCountry].ownerID = 0;
        game.countries[movement.targetCountry].ownerID = 1;
        await expect(move(game, movement)).rejects.toThrow(moveError);

    })

    test('should throw an error if not in play phase', async () => {
        let game = createTestGame(4);
        let movement: Movement = {
            sourceCountry: 0,
            targetCountry: 1,
            armies: 1
        }
        game.phase = 'deploy';
        game.countries[movement.sourceCountry].ownerID = 0;
        game.countries[movement.targetCountry].ownerID = 0;
        await expect(move(game, movement)).rejects.toThrow(moveError);
    })

    test('shoud throw an error if moving too many armies', async () => {
        let game = createTestGame(4);
        let movement: Movement = {
            sourceCountry: 0,
            targetCountry: 1,
            armies: 1
        }
        game.phase = 'play';
        game.turnTracker.phase = 'combat';
        game.countries[movement.sourceCountry].ownerID = 0;
        game.countries[movement.targetCountry].ownerID = 0;
        game.countries[movement.sourceCountry].armies = 1;
        await expect(move(game, movement)).rejects.toThrow(moveError);
    })

    test('should throw an error if not in combat phase', async () => {
        let game = createTestGame(4);
        let movement: Movement = {
            sourceCountry: 0,
            targetCountry: 1,
            armies: 1
        }
        game.phase = 'play';
        game.turnTracker.phase = 'deploy';
        game.countries[movement.sourceCountry].ownerID = 0;
        game.countries[movement.targetCountry].ownerID = 0;
        game.countries[movement.sourceCountry].armies = 2;
        await expect(move(game, movement)).rejects.toThrow(moveError);
    })

    test('should move armies and set turnPhase to end, disabling second move', async () => {
        let game = createTestGame(4);
        let movement: Movement = {
            sourceCountry: 0,
            targetCountry: 1,
            armies: 1
        }
        game.phase = 'play';
        game.turnTracker.phase = 'combat';
        game.countries[movement.sourceCountry].ownerID = 0;
        game.countries[movement.targetCountry].ownerID = 0;
        game.countries[movement.sourceCountry].armies = 5;
        game.countries[movement.targetCountry].armies = 1;
        const response: WsResponse = await move(game, movement);
        expect(response.data.gameState.turnTracker.phase).toBe('end');
        expect(response.data.gameState.countries[movement.sourceCountry].armies).toBe(4);
        expect(response.data.gameState.countries[movement.targetCountry].armies).toBe(2);
        await expect(move(game, movement)).rejects.toThrow(moveError);
    })
})