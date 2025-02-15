import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import newGame from './newGame';
import {defaultGlobeSeed} from '../globes/default/defaultGlobeSeed';
import createTestPlayers from '../common/util/test/createTestPlayers';
import { playerCountError } from '../common/types/errors';

describe('New game', () => {

    it('should create a new game using default globe and default playermax', async () => {
        let globe = defaultGlobeSeed();
        let players = createTestPlayers(globe.playerMax);
        let game = await newGame(players, globe);
        expect(game.id).toBeTruthy();
    })

    it('should throw an error if player count exceeds globe player max', async () => {
        let globe = defaultGlobeSeed();
        let players = createTestPlayers(globe.playerMax + 1);
        await expect(newGame(players, globe)).rejects.toThrow(playerCountError);
    })
})