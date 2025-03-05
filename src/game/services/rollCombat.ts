import { Engagement } from "../../common/types/types";

export function roll(dice: number): number[] {
    let rolls: number[] = [];
    for (let i = 0; i < dice; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort((a: number, b: number) => b - a);
    return rolls;
}

export default function rollCombat(engagement: Engagement): Engagement {
    let attackers: number;
    let defenders: number;
    engagement.attackersLost = 0;
    engagement.defendersLost = 0;
    if (engagement.attackingTroopCount > 3) {
        attackers = 3;
     } else {
        attackers = engagement.attackingTroopCount;
     }
    if (engagement.defendingTroopCount > 2) {
        defenders = 2;
    } else {
        defenders = engagement.defendingTroopCount;
    }

    engagement.attackerRolls = roll(attackers);
    engagement.defenderRolls = roll(defenders);

    const minDice: number = Math.min(engagement.attackerRolls.length, engagement.defenderRolls.length);
    for (let i = 0; i < minDice; i++) {
        if (engagement.attackerRolls[i] > engagement.defenderRolls[i]) {
            engagement.defendersLost += 1;
        } else {
            engagement.attackersLost += 1;
        }
    }
    return engagement
}