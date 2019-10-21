import { RefObject } from 'react';

export interface IState {
    canvas: any;
    screen: {
        width: number;
        height: number;
        ratio: number;
    },
}

export interface ICanvas {
    game: IGameState;
    canvas?: RefObject<HTMLCanvasElement>,
    screen?: {
        width: number;
        height: number;
        ratio: number;
    }
}

export interface IGameState {
    currentPlayer: string;
    nextFenString: string;
    nextPlayerTurn: string;
    movePieceFrom: string;
    movePieceTo: string;
}
