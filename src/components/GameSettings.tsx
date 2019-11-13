import React, { useContext } from 'react';
import { GameContext } from './GameContext';

const GameSettings = () => {
    const gameSettings = useContext(GameContext);
    
    return (
        <form>
            <input name="fen" type="text" />
            <button onClick={(event: React.FormEvent) => {
                event.preventDefault();
            }}>Set</button>
        </form>
    );
}

export default GameSettings;
