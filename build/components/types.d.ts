import { ReactNode } from 'react';
export interface IGameContext {
    getGameState: IGameCanvas;
    setGameState: React.Dispatch<React.SetStateAction<IGameCanvas>>;
}
export interface IGameProviderProps {
    defaults?: Partial<IGameContext>;
    children?: ReactNode;
}
export interface IGameCanvas {
    game: IGameState;
    player: string;
    controller?: (props: IGameState) => void;
    resetGame?: boolean;
}
export interface IGameState {
    nextFenString: string;
    nextPlayerTurn: string;
    movePieceFrom: string;
    movePieceTo: string;
}
