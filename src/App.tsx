import React from "react";
import ChessEngine from "./components";

const initialGameState = {
    currentPlayer: "Demo",
    fenString: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    playerTurn: "Demo",
    movePieceFrom: "",
    movePieceTo: ""
}

const App = () => {
    return (
        <ChessEngine
            currentPlayer={initialGameState.currentPlayer}
            nextFenString={initialGameState.fenString}
            nextPlayerTurn={initialGameState.playerTurn}
            movePieceFrom={initialGameState.movePieceFrom}
            movePieceTo={initialGameState.movePieceTo}
        />
    );
}

export default App;
