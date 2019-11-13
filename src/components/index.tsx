import React, { useContext } from 'react';
import { GameContext } from './GameContext';
import Canvas from './Canvas';

const GameCanvas = () => {
    const gameSettings = useContext(GameContext);
    
    return (
        <Canvas 
            player={gameSettings.getGameState.player}
            game={gameSettings.getGameState.game}
        />
    )
}

export default GameCanvas;
