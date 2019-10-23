import React from "react";

import { IGameState } from './components/types';

const App: any = (props: IGameState) => {
    return (
        <h1>Hello, World!</h1>
        // <ChessEngine
        //     currentPlayer={props.currentPlayer}
        //     nextFenString={props.nextFenString}
        //     nextPlayerTurn={props.nextPlayerTurn}
        //     movePieceFrom={props.movePieceFrom}
        //     movePieceTo={props.movePieceTo}
        // />
    );
}

export default App;
