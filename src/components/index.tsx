import React, { useContext } from 'react';
import { GameContext } from './provider/GameContext';
import GameCanvas from './game/ui/GameCanvas';
import { IGameState } from './types';

const GameEntryPoint = () => {
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
        <GameCanvas 
            player={gameSettings.getGameState.player}
            game={gameSettings.getGameState.game}
            controller={mediator}
            resetGame={gameSettings.getGameState.resetGame}
        />
    )
}

export default GameEntryPoint;
