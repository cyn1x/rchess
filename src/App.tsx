import React from "react";
import { IGameState } from "./components/types";
import ChessEngine from "./components";

const initialState = {
    currentPlayer: "Demo",
    fenString: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    playerTurn: "Demo",
    movePieceFrom: "",
    movePieceTo: ""
}

const App: any = (props: IGameState) => {
    return (
        <ChessEngine
            currentPlayer={initialState.currentPlayer}
            nextFenString={initialState.fenString}
            nextPlayerTurn={initialState.playerTurn}
            movePieceFrom={initialState.movePieceFrom}
            movePieceTo={initialState.movePieceTo}
        />
    );
}

export default App;
