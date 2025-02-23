import loadGlobe from "./loadGlobe";
import { describe, it, test, expect } from '@jest/globals';

describe('Load globe' , () => {

    test('should load a known globe', async () => {
        let globe = await loadGlobe('defaultGlobeID');
        expect(globe.id).toBe('defaultGlobeID');
        expect(globe.name).toBe('Earth');
    })

    test('should throw a globe not found error if globe does not exist', async () => {
        await expect(loadGlobe('This globe should not exist')).rejects.toThrow();
    })
})