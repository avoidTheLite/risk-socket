import { Player } from "../../types/types";

const testPlayerSeed: Player[] = [
    {
        id: 0,
        name: 'Test Justin',
        color: 'red',
        armies: 0,
        cards: []
    },
    {
        id: 1,
        name: 'Test Joan',
        color: 'blue',
        armies: 0,
        cards: []

    },
    {
        id: 2,
        name: 'Test Ernie',
        color: 'black',
        armies: 0,
        cards: []

    },
    {
        id: 3,
        name: 'Test Dejan',
        color: 'orange',
        armies: 0,
        cards: []

    },
    {
        id: 4,
        name: 'Test Kyle',
        color: 'pink',
        armies: 0,
        cards: []

    },
    {
        id: 5,
        name: 'Test Brennan',
        color: 'purple',
        armies: 0,
        cards: []

    },
    {
        id: 6,
        name: 'Test Mark',
        color: 'green',
        armies: 0,
        cards: []

    },
    {
        id: 7,
        name: 'Test Diane',
        color: 'yellow',
        armies: 0,
        cards: []

    }
]

export default function createTestPlayers(playerCount: number) {
    let players: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
        const newPlayer = new Player(i, testPlayerSeed[i].name, testPlayerSeed[i].color, testPlayerSeed[i].armies, testPlayerSeed[i].cards);
        players.push(newPlayer);
    }
    return players
}