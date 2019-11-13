/// <reference types="node" />
import React from 'react';
import { IGameCanvas, IState } from './types';
import { IPiece } from './pieces/types';
import Square from './Square';
declare class Canvas extends React.Component<IGameCanvas, IState> {
    private game;
    private canvas;
    private width;
    private height;
    private ratio;
    constructor(props: IGameCanvas);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    resizeCallback: () => NodeJS.Timeout;
    initialise(): void;
    update(): void;
    drawBoard(): void;
    setSequareColours(i: number, rank: number, ctx: any): void;
    drawPieces(): void;
    drawImg(img: HTMLImageElement, file: number, rank: number): void;
    interceptClick(event: any): void;
    handleClick(event: MouseEvent): void;
    activateSquare(activeSquare: Square): void;
    deactivateSquare(activeSquare: Square): void;
    overwriteSquare(activeSquare: Square): void;
    manageValidSquares(): void;
    drawValidSquares(): void;
    constructImage(activeSquare: IPiece): HTMLImageElement;
    drawPiece(validMoves: IPiece): HTMLImageElement;
    selectCell(square: Square): void;
    setNextState(prevPos: string, nextPos: string): void;
    isDemonstrationMode(): boolean;
    render(): JSX.Element;
    getCellDimensions(): {
        cw: number;
        ch: number;
    };
}
export default Canvas;
