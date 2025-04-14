import { Game, Player, Card, WsResponse } from "../../common/types/types";
import NextTurnManager from "../services/NextTurnManager"

export default async function endTurn(game: Game): Promise<WsResponse> {
    const nextTurnManager = new NextTurnManager(game);
    return await nextTurnManager.endTurn();
}