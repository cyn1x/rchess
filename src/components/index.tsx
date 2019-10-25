import React from 'react';
import { ICanvas } from './types';
import Canvas from './Canvas';

const ChessEngine = (props: ICanvas) => {
    return (
        <Canvas 
            player={props.player}
            game={props.game}
        />
    )
}

export default ChessEngine;
