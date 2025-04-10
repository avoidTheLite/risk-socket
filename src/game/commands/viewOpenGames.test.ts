import viewOpenGames from "./viewOpenGames";
import { manager } from "../../common/util/createWebSocketServer";
import { describe, test, expect } from '@jest/globals';
import { WsResponse, GameSlots } from "../../common/types/types";



describe('View open games - unit tests', () => {

    beforeAll(() => {
        
    })

    afterAll(() => {
        jest.restoreAllMocks();
    })

    test('should return an empty array when there are no open games', () => {
        
        jest.spyOn(manager, 'getOpenGames').mockReturnValueOnce([]);
        const response: WsResponse = viewOpenGames();

        expect(response.data.action).toBe('viewOpenGames');
        expect(response.data.status).toBe('success');
        expect(response.data.message).toMatch(/0 open games/);

    })

    test('should return a list of open games when they exist', () => {

        const mockGameSlots: GameSlots[] = [
            { saveName: 'testSaveName1', playerSlots: [0, 1, 2, 3, 4] },
            { saveName: 'testSaveName2', playerSlots: [0, 1, 2, 3] },
        ]

        jest.spyOn(manager, 'getOpenGames').mockReturnValueOnce(mockGameSlots);
        const response: WsResponse = viewOpenGames();

        expect(response.data.action).toBe('viewOpenGames');
        expect(response.data.status).toBe('success');
        expect(response.data.message).toMatch(/2 open games/);
        expect(response.data.gameSlots).toEqual(mockGameSlots);

    })
})