/// <reference types="node" />
import React from 'react';
import { IGameCanvas } from '../types';
import { IState } from './types';
import { IPiece } from './pieces/types';
import Square from './Square';
declare class GameCanvas extends React.Component<IGameCanvas, IState> {
    private game;
    private canvas;
    private width;
    private height;
    private ratio;
    constructor(props: IGameCanvas);
    initialise(): void;
    resizeCallback: () => NodeJS.Timeout;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    resetGame(): void;
    updateOpponentMove(): void;
    update(): void;
    drawBoard(): void;
    setSequareColours(i: number, rank: number, ctx: any): void;
    drawPieces(): void;
    drawImg(img: HTMLImageElement, file: number, rank: number): void;
    interceptClick(event: any): void;
    handleClick(event: MouseEvent): void;
    handlePlayerMove(attackedSquare: Square): void;
    handleOpponentMove(updatedSquare: Square): void;
    handleSpecialSquare(attackedSquare: Square): void;
    activateSquare(activeSquare: Square): void;
    deactivateSquare(activeSquare: Square): void;
    overwriteSquare(activeSquare: Square): void;
    manageValidSquares(): void;
    drawValidSquares(): void;
    constructImage(activeSquare: IPiece): HTMLImageElement;
    drawPiece(validMoves: IPiece): HTMLImageElement;
    selectCell(square: Square): void;
    setNextState(prevPos: string, nextPos: string): void;
    render(): JSX.Element;
    getCellDimensions(): {
        cw: number;
        ch: number;
    };
}
export default GameCanvas;
