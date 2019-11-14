import React, { useContext } from 'react';
import { GameContext } from './GameContext';
import Canvas from './Canvas';
import { IGameState } from './types';

const GameCanvas = () => {
    const gameSettings = useContext(GameContext);

    const mediator = (props: IGameState) => {
        gameSettings.setGameState({
            player: gameSettings.getGameState.player,
            game: {
                nextFenString: props.nextFenString,
                nextPlayerTurn: props.nextPlayerTurn,
                movePieceFrom: props.movePieceFrom,
                movePieceTo: props.movePieceTo
            },
            resetGame: false
        })
    }

    return (
        <Canvas 
            player={gameSettings.getGameState.player}
            game={gameSettings.getGameState.game}
            controller={mediator}
            resetGame={gameSettings.getGameState.resetGame}
        />
    )
}

export default GameCanvas;
