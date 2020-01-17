import React, { useContext } from 'react';
import { GameContext } from './GameContext';

export const GameInfo = () => {
    const gameSettings = useContext(GameContext);
    const gameState = gameSettings.getGameState;

    return (
        <div id="info-area">
            <h3>Current Game State</h3>
            <div id="game-info">
                <p><b>Player</b>: {gameState.player}</p>
                <p><b>Board State:</b> {gameState.game.nextFenString}</p>
                <p><b>Player Turn:</b> {gameState.game.nextPlayerTurn}</p>
                <p><b>Move From:</b> {gameState.game.movePieceFrom}</p>
                <p><b>Move To:</b> {gameState.game.movePieceTo}</p>
            </div>
        </div>
    )
}

export default GameInfo;
