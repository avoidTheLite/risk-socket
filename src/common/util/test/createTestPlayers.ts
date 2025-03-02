import { Player } from "../../types/types";

const testPlayerSeed: Player[] = [
    {
        id: 0,
        name: 'Test Justin',
        color: 'red',
        armies: 0,
    },
    {
        id: 1,
        name: 'Test Joan',
        color: 'blue',
        armies: 0,
    },
    {
        id: 2,
        name: 'Test Ernie',
        color: 'black',
        armies: 0,
    },
    {
        id: 3,
        name: 'Test Dejan',
        color: 'orange',
        armies: 0,
    },
    {
        id: 4,
        name: 'Test Kyle',
        color: 'pink',
        armies: 0,
    },
    {
        id: 5,
        name: 'Test Brennan',
        color: 'purple',
        armies: 0,
    },
    {
        id: 6,
        name: 'Test Mark',
        color: 'green',
        armies: 0,
    },
    {
        id: 7,
        name: 'Test Diane',
        color: 'yellow',
        armies: 0,
    }
]

export default function createTestPlayers(playerCount: number) {
    let players: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
        players.push(testPlayerSeed[i]);
    }
    return players
}