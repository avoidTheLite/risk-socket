import { Player } from "../../types/types";

const testPlayerSeed: Player[] = [
    {
        id: '0',
        name: 'Test Justin',
        color: 'red',
    },
    {
        id: '1',
        name: 'Test Joan',
        color: 'blue',
    },
    {
        id: '2',
        name: 'Test Ernie',
        color: 'black',
    },
    {
        id: '3',
        name: 'Test Dejan',
        color: 'orange',
    },
    {
        id: '4',
        name: 'Test Kyle',
        color: 'pink',
    },
    {
        id: '5',
        name: 'Test Brennan',
        color: 'purple',
    },
    {
        id: '6',
        name: 'Test Mark',
        color: 'green',
    },
    {
        id: '7',
        name: 'Test Diane',
        color: 'yellow',
    }
]

export default function createTestPlayers(playerCount: number) {
    let players: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
        players.push(testPlayerSeed[i]);
    }
    return players
}