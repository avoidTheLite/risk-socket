import newGame from "./newGame";

export default async function wsMessageHandler(data: any) {
    switch(data.action) {
    case 'newGame':
        const game = await newGame(data.players, data.globe);

        return game
    case 'echo':
        return data.message
    }
}