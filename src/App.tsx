import React from "react";
import ChessEngine from './components/index';
import { IGameState } from './components/types';

const App: any = (props: IGameState) => {
    return (
        <ChessEngine
            currentPlayer={props.currentPlayer}
            nextFenString={props.nextFenString}
            nextPlayerTurn={props.nextPlayerTurn}
            movePieceFrom={props.movePieceFrom}
            movePieceTo={props.movePieceTo}
        />
    );
}

export default App;
