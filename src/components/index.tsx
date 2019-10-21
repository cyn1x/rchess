import React from 'react';
import { IGameState } from './types';
import Canvas from './Canvas';

const ChessEngine = (props: IGameState) => {
    return (
        <Canvas game={props} />
    )
}

export default ChessEngine;
