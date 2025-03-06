import { default as rollCombat, roll } from "./rollCombat";
import { describe, test, expect } from '@jest/globals';
import { Engagement } from "../../common/types/types";

describe('roll - Unit tests', () => {

    test('should roll the correct number of dice', () => {
        const dice: number = 3;
        const rolls: number[] = roll(dice);
        expect(rolls.length).toBe(dice);
    })

    test('all rolls should be integers between 1 and 6', () => {
        const dice: number = 10;
        const rolls: number[] = roll(dice);
        for (let i = 0; i < rolls.length; i++) {
            expect(rolls[i]).toBeGreaterThanOrEqual(1);
            expect(rolls[i]).toBeLessThanOrEqual(6);
            expect(Number.isInteger(rolls[i])).toBe(true);
        }
    })
})

describe('rollCombat - unit tests', () => {

    test('should always lose 2 armies when both countries have at least 2 combatants', () => {
        const engagement: Engagement = {
            attackingCountry: 0,
            defendingCountry: 1,
            attackingTroopCount: 3,
            defendingTroopCount: 2
        }
        const result: Engagement = rollCombat(engagement);
        expect(result.attackersLost+result.defendersLost).toBe(2);
    })

    // test('attacker loses 2 armies when attacker rolls only 1', () => {
    //     const rollMock 

    //     const engagement: Engagement = {
    //         attackingCountry: 0,
    //         defendingCountry: 1,
    //         attackingTroopCount: 1,
    //         defendingTroopCount: 2
    //     }
    //     const result: Engagement = rollCombat(engagement);

    // })
})