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
    player: string;
    controller?: (props: any) => any;
}

export interface IGameState {
    nextFenString: string;
    nextPlayerTurn: string;
    movePieceFrom: string;
    movePieceTo: string;
}
