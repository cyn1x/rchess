import React, { useState, createContext } from 'react';
import { IGameCanvas } from '../types';
import { IGameContext, IGameProviderProps } from '../types';

const initialGameState: IGameCanvas = {
    player: "Demo",
    game: {
        nextFenString: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        nextPlayerTurn: "White",
        movePieceFrom: "",
        movePieceTo: ""
    },
    resetGame: false
};

const defaultGameState: IGameContext = {
    getGameState: initialGameState,
    setGameState: (): void => {}
};

export const GameContext = createContext<IGameContext>(defaultGameState);

export const GameProvider = (props: IGameProviderProps) => {
    const [getGameState, setGameState] = useState<IGameCanvas>({
        ...initialGameState,
        ...props.defaults,
    });
    
    return(
        <GameContext.Provider value={{ getGameState, setGameState }}>
            {props.children}
        </GameContext.Provider>
    )
}
