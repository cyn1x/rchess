import React from 'react';

import {
    ICanvas, IState
} from './types';

import { IPiece } from './pieces/types';
import Game from './Game';
import Square from './Square';

const boardSize = () => { return ( (window.innerWidth > window.innerHeight) ); }

class Canvas extends React.Component<ICanvas, IState> {
    private game: Game;
    private canvas = React.createRef<HTMLCanvasElement>();
    private width = (boardSize() ? window.innerWidth: window.innerHeight) / 2.5;
    private height = this.width;
    private ratio = this.width / this.height
    
    constructor(props: ICanvas) {
        super(props);
        this.update = this.update.bind(this)
        this.state = {
            canvas: this.canvas,
            screen: {
                width: this.height * (this.width / this.height),
                height: this.width,
                ratio: this.ratio
            }
        };
        this.game = new Game(this.props.game.currentPlayer, this.props.game.nextFenString, this.props.game.nextPlayerTurn);
        this.initialise();
    }

    componentDidMount() {
        this.update();
        window.addEventListener('resize', this.resizeCallback, false);
        this.state.canvas.current.addEventListener("click", (event: EventTarget) => { this.interceptClick(event) }, false);
    }

    componentWillUnmount() {}

    componentDidUpdate() {
        if (this.props.game.nextPlayerTurn === this.game.getCurrentPlayer().getColour() && this.game.getFenString() !== this.props.game.nextFenString) {
            
            const updatedSquare = this.game.updateGameState(this.props.game);
            if (updatedSquare) {
                this.overwriteSquare(updatedSquare);
            }
        }
    }

    resizeCallback = () => setTimeout(this.update, 500);

    initialise() {
        const {cw, ch} = this.getCellDimensions();
        this.game.initialise(cw, ch);
    }

    update() {
        this.width = (boardSize() ? window.innerWidth: window.innerHeight) / 2.5
        this.height = this.width
        this.setState({
            canvas: this.canvas,
            screen: {
                width: this.height * (this.width / this.height),
                height: this.height,
                ratio: this.ratio
            }
        })
        const {cw, ch} = this.getCellDimensions();
        this.game.updateSquareSizeProps(cw, ch);
        this.drawBoard();
        this.drawPieces();
    }

    drawBoard() {
        const ctx = this.state.canvas.current.getContext('2d');
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        let rank = 0;

        for (let i = 0; i < this.game.getChessboard().getSquaresArray().length; i++) {

            const x = this.game.getChessboard().getSquaresArray()[i].getX();
            const y = this.game.getChessboard().getSquaresArray()[i].getY();
            const w = this.game.getChessboard().getSquaresArray()[i].getWidth();
            const h = this.game.getChessboard().getSquaresArray()[i].getHeight();

            if (i % 8 === 0) { rank++; }

            this.setSequareColours(i, rank, ctx)
            ctx.strokeRect(x, y, w, h)
            ctx.fillRect(x, y, w, h)
        }
    }

    setSequareColours(i: number, rank: number, ctx: any) {
        if ((i + rank) % 2 === 0) {
            ctx.strokeStyle = '#1a1a1a';
            ctx.fillStyle = '#f2f2f2';
            this.game.getChessboard().getSquaresArray()[i].setColour('#f2f2f2');
        }
        else {
            ctx.strokeStyle = '#f2f2f2';
            ctx.fillStyle = '#1a1a1a';
            this.game.getChessboard().getSquaresArray()[i].setColour('#1a1a1a');
        }
    }

    drawPieces() {
        const squaresArray = this.game.getChessboard().getSquaresArray();
        const files = this.game.getChessboard().getFiles();
        const ranks = this.game.getChessboard().getRanks();

        squaresArray.forEach( (square: Square, index: number) => {
            if (square.getPiece()) {
                const piece = square.getPiece()
                const position = piece.getPosition().split("")
                const img = new Image();
                img.src = piece.getImage();
                img.id = piece.getType();

                this.drawImg(img, ranks.indexOf(Number(position[1])), files.indexOf(position[0]))
            }
        })
    }

    drawImg(img: HTMLImageElement, file: number, rank: number) {
        const ctx = this.state.canvas.current.getContext('2d');
        const {cw, ch} = this.getCellDimensions();
        if (!img.complete) {
            setTimeout(() => { this.drawImg(img, file, rank) }, 50);
        }
        if (img.id === 'P' || img.id === 'p') {
            ctx.drawImage(img, (cw * rank) + cw * 0.2, (ch * file) + ch * 0.1, cw * 0.6, ch * 0.8)
        }
        else {
            ctx.drawImage(img, (cw * rank) + cw * 0.1, (ch * file) + ch * 0.1, cw * 0.8, ch * 0.8)
        }
    }

    interceptClick(event: any) {
        if (this.game.getCurrentTurn() === this.game.getCurrentPlayer().getColour()) {
            this.handleClick(event);
        }
    }

    handleClick(event: MouseEvent) {
        const cx = event.offsetX;
        const cy = event.offsetY;
        const squaresArray = this.game.getChessboard().getSquaresArray();

        for (let i = 0; i < squaresArray.length; i++) {
            const sx = squaresArray[i].getX();
            const sy = squaresArray[i].getY();
            const sw = squaresArray[i].getWidth();
            const sh = squaresArray[i].getHeight();

            if (cx >= sx && cx <= sx + sw && cy >= sy && cy <= sy + sh) {
                if (this.game.getSquareActive()) {
                    if (this.game.getChessboard().getActiveSquare() === squaresArray[i]) {
                        this.deactivateSquare(squaresArray[i]);
                    }
                    else if (this.game.getChessboard().getActiveSquare() !== squaresArray[i]) {
                        if (!this.game.checkRequestedMove(squaresArray[i])) {
                            return;
                        }
                        const prevActiveSquarePos = this.game.getChessboard().getActiveSquare().getPosition();
                        const nextActiveSquarePos = squaresArray[i].getPosition();
                        this.game.setSquareActive(false);
                        this.overwriteSquare(squaresArray[i]);
                        this.setNextState(prevActiveSquarePos, nextActiveSquarePos);
                    }
                    return;
                }
                if (squaresArray[i].squareContainsPiece()) {
                    if (squaresArray[i].getPiece().getColour() === this.game.getCurrentPlayer().getColour()) {
                        this.activateSquare(squaresArray[i])
                    }
                }
            }
        }
    }

    activateSquare(activeSquare: Square) {
        const files = this.game.getChessboard().getFiles();
        const ranks = this.game.getChessboard().getRanks();
        const activePiece = activeSquare.getPiece();
        const img = this.constructImage(activePiece);

        this.game.handleActivatedSquare(activeSquare);

        this.manageValidSquares();
        this.selectCell(activeSquare);
        this.drawImg(img, ranks.indexOf(Number(activeSquare.getPosition()[1])), files.indexOf(activeSquare.getPosition()[0]));
    }

    deactivateSquare(activeSquare: Square) {
        const files = this.game.getChessboard().getFiles();
        const ranks = this.game.getChessboard().getRanks();
        const activePiece = activeSquare.getPiece();
        const img = this.constructImage(activePiece);

        this.game.handleDeactivatedSquare();

        this.manageValidSquares();
        this.selectCell(activeSquare);
        this.drawImg(img, ranks.indexOf(Number(activeSquare.getPosition()[1])), files.indexOf(activeSquare.getPosition()[0]));
    }

    overwriteSquare(activeSquare: Square) {
        const files = this.game.getChessboard().getFiles();
        const ranks = this.game.getChessboard().getRanks();
        const prevActiveSquare = this.game.getChessboard().getActiveSquare();
        const activePiece = prevActiveSquare.getPiece();
        const img = this.constructImage(activePiece);

        this.selectCell(prevActiveSquare);
        this.manageValidSquares();
        this.selectCell(activeSquare);
        this.game.handleOverwriteSquare(activeSquare, activePiece);

        this.drawImg(img, ranks.indexOf(Number(activeSquare.getPosition()[1])), files.indexOf(activeSquare.getPosition()[0]));
    }

    manageValidSquares() {
        if (this.game.getSquareActive()) {
            const activeSquare = this.game.getChessboard().getActiveSquare().getPosition();
            const activePiece = this.game.getChessboard().getActiveSquare().getPiece();

            this.game.checkValidMoves(activeSquare, activePiece)
            this.drawValidSquares();

            return;
        }
        this.drawValidSquares();
        this.game.setValidMoves([]);
    }

    drawValidSquares() {
        const files = this.game.getChessboard().getFiles();
        const ranks = this.game.getChessboard().getRanks();

        if (this.game.getValidMoves().length > 0) {
            const validMoves = this.game.getValidMoves()
            for (let i = 0; i < validMoves.length; i++) {

                this.selectCell(validMoves[i]);

                if (validMoves[i].squareContainsPiece()) {
                    const img = this.drawPiece(validMoves[i].getPiece())
                    this.drawImg(img, ranks.indexOf(Number(validMoves[i].getPosition()[1])), files.indexOf(validMoves[i].getPosition()[0]));
                }
            }
        }
    }

    constructImage(activeSquare: IPiece) {
        const img = new Image();
        img.src = activeSquare.getImage();
        img.id = activeSquare.getType();

        return img;
    }

    drawPiece(validMoves: IPiece) {
        const img = new Image();
        img.id = validMoves.getType();
        img.src = validMoves.getImage();

        return img;
    }

    selectCell(square: Square) {
        const ctx = this.state.canvas.current.getContext('2d');
        const sx = square.getX();
        const sy = square.getY();
        const sw = square.getWidth();
        const sh = square.getHeight();

        if (this.game.getSquareActive()) {
            ctx.fillStyle = '#6F9EFF';
        }
        else {
            ctx.fillStyle = square.getColour();
        }

        ctx.strokeRect(sx, sy, sw, sh);
        ctx.fillRect(sx, sy, sw, sh);
    }

    setNextState(prevPos: string, nextPos: string) {
        const newFenSequence = this.game.fenCreator();
        const nextPlayerMove = this.game.getNextMove();

        this.game.setCurrentTurn(nextPlayerMove);
    }

    render() {
        return (
                <canvas ref={ this.state.canvas }
                    width={ this.state.screen.width * this.state.screen.ratio }
                    height={ this.state.screen.height * this.state.screen.ratio }
                />
        );
    }

    getCellDimensions() {
        const cw = (this.state.screen.width * this.state.screen.ratio) / 8;
        const ch = (this.state.screen.height * this.state.screen.ratio) / 8;
        return {cw, ch}
    }
}

export default Canvas;
