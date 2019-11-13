import { ReactNode } from 'react';
export interface IGameContext {
    getGameState: IGameCanvas;
    setGameState: React.Dispatch<React.SetStateAction<IGameCanvas>>;
}
export interface IGameProviderProps {
    defaults?: Partial<IGameContext>;
    children?: ReactNode;
}
export interface IState {
    canvas: any;
    screen: {
        width: number;
        height: number;
        ratio: number;
    };
}
export interface IGameCanvas {
    game: IGameState;
    player: string;
    controller?: (props: IGameState) => void;
}
export interface IGameState {
    nextFenString: string;
    nextPlayerTurn: string;
    movePieceFrom: string;
    movePieceTo: string;
}
