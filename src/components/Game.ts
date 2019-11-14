import { IPiece } from './pieces/types';

import GameState from './GameState';
import PiecesFactory from './PiecesFactory';
import Board from './Board';
import Square from './Square';
import Player from './Player';

class Game {
    private gameState: GameState;
    private chessBoard: Board;
    private isSquareClicked: boolean;
    private validMoves!: Array<Square>;
    private currentPlayer!: Player;

    constructor(player: string, fen: string, turn: string) {
        this.gameState = new GameState();
        this.chessBoard = new Board();
        this.isSquareClicked = false;
        this.validMoves = [];
        
        if (player === "Demo") { this.currentPlayer = new Player("Demo"); }
        else { this.currentPlayer = new Player(this.determinePlayerColour(player)); }

        this.gameState.setFenString(fen);
        this.gameState.setCurrentTurn(turn);
    }
    
    initialise(cw: number, ch: number) {
        const files = this.chessBoard.getFiles();
        const ranks = this.chessBoard.getRanks();
        let squaresArray = this.chessBoard.getSquaresArray();
        for (let i = 0; i < files.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                squaresArray[i + j * 8] = new Square(files[i] + ranks[j], i * cw, j * cw, cw, ch);
            }
        }
        this.chessBoard.setSquaresArray(squaresArray);
        this.setPiecePositions();
    }

    determinePlayerColour(player: string) {
        return player === "Player 1" ? "White" : "Black";
    }

    updateGameState(gameProps: any) {
        const squaresArray = this.chessBoard.getSquaresArray();
        
        if (gameProps.nextPlayerTurn !== this.gameState.getCurrentTurn()) {
            for (let i = 0; i < squaresArray.length; i++) {
                if (squaresArray[i].getPosition() === gameProps.movePieceFrom) {
                    this.chessBoard.setActiveSquare(squaresArray[i]);
                }
            }
            for (let i = 0; i < squaresArray.length; i++) {
                if (squaresArray[i].getPosition() === gameProps.movePieceTo) {
                    this.gameState.setCurrentTurn(gameProps.nextPlayerTurn);
                    this.gameState.setFenString(gameProps.nextFenString);
                    return squaresArray[i];
                }
            }
        }
    }

    updateSquareSizeProps(cw: number, ch: number) {
        const files = this.chessBoard.getFiles();
        const ranks = this.chessBoard.getRanks();
        let squaresArray = this.chessBoard.getSquaresArray();
        for (let i = 0; i < files.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                squaresArray[i + j * 8].setX(i * cw);
                squaresArray[i + j * 8].setY(j * cw);
                squaresArray[i + j * 8].setWidth(cw);
                squaresArray[i + j * 8].setHeight(ch);
            }
        }
        this.chessBoard.setSquaresArray(squaresArray);
    }

    setPiecePositions() {
        const piecesFactory = new PiecesFactory();
        const startingFen = this.gameState.getFenString();
        const squaresArray = this.chessBoard.getSquaresArray();
        const piecesArray = this.fenParser(startingFen);
        let currentRank = 0;
        let currentFile = 0;
        
        piecesArray.forEach( (pieceRequired: string, index: number) => {
            if (index % 8 === 0 && index !== 0) {
                currentRank = currentRank + 1;
                currentFile = 0;
            }
            if (index % 8 !== 0) {
                currentFile = currentFile + 1;
            }
            startingFen.split("").forEach( (pieceToPlace: string) => {
                if (pieceRequired === pieceToPlace) {
                    const newPiece = (piecesFactory.typeOfPiece(pieceToPlace));
                    squaresArray[index].setPiece(newPiece);
                }
            })
        })
    }

    fenParser(fen: string) {
        const fenString = fen.split(" ");
        const positions = fenString[0].split("/");
        const pieces = this.chessBoard.getPiecePositionsArray();

        let currentSquare = 0;
        positions.forEach( rank => {
            rank.split("").forEach( char => {
                if (!Number(char)) {
                    pieces[currentSquare] = char;
                    currentSquare++;
                }
                else {
                    currentSquare += Number(char);
                }
            })
        })
        return pieces
    }

    fenCreator() {
        const board = this.getChessboard().getSquaresArray();
        let newFenString = "";
        let emptySquares = 0;
        for (let i = 0; i < board.length; i++) {
            
            if (i % 8 === 0 && i !== 0) {
                newFenString += "/"
                emptySquares = 0;
            }
            
            if (board[i].squareContainsPiece()) {
                newFenString += board[i].getPiece().getType();
                emptySquares = 0;
            } else {
                emptySquares++;
                if ((i + 1) < 63) {
                    if ((i + 1) % 8 === 0) {
                        newFenString += emptySquares;
                    }
                    else if (board[i + 1].squareContainsPiece()) {
                        newFenString += emptySquares;
                    }
                }
            }
        }
        return newFenString;
    }

    handleActivatedSquare(activeSquare: Square) {
        this.setSquareActive(true);
        this.chessBoard.setActiveSquare(activeSquare);
    }

    handleDeactivatedSquare() {
        const emptySquare = new Square('0', 0, 0, 0, 0);
        
        this.chessBoard.setActiveSquare(emptySquare);
        this.setSquareActive(false);
    }

    handleOverwriteSquare(activeSquare: Square, activePiece: IPiece) {
        this.chessBoard.getActiveSquare().removePiece();
        this.chessBoard.setActiveSquare(activeSquare);
        this.incrementMoveCount(activePiece);
        activeSquare.setPiece(activePiece);
    }

    checkValidMoves(pos: string, piece: IPiece) {
        const files = this.chessBoard.getFiles();
        const pieceMoves = piece.getMoveDirections();

        const file = files.indexOf(pos[0])
        const rank = Number(pos[1])

        let currentMove = 0;
        if (pieceMoves) {
            pieceMoves.forEach( (step: number, cardinal: string) => {

                const generalMoveDirections: any = {
                    'N': () => (this.checkBounds(file, rank + currentMove, piece)),
                    'S': () => (this.checkBounds(file, rank - currentMove, piece)),
                    'E': () => (this.checkBounds(file + currentMove, rank, piece)),
                    'W': () => (this.checkBounds(file - currentMove, rank, piece)),
                    'NE': () => (this.checkBounds(file + currentMove, rank + currentMove, piece)),
                    'SE': () => (this.checkBounds(file + currentMove, rank - currentMove, piece)),
                    'NW': () => (this.checkBounds(file - currentMove, rank + currentMove, piece)),
                    'SW': () => (this.checkBounds(file - currentMove, rank - currentMove, piece))
                }

                const knightMoveDirections: any = {
                    'NNE': () => (this.checkBounds(file + 1, rank + 2, piece)),
                    'ENE': () => (this.checkBounds(file + 2, rank + 1, piece)),
                    'ESE': () => (this.checkBounds(file + 2, rank - 1, piece)),
                    'SSE': () => (this.checkBounds(file + 1, rank - 2, piece)),
                    'SSW': () => (this.checkBounds(file - 1, rank - 2, piece)),
                    'WSW': () => (this.checkBounds(file - 2, rank - 1, piece)),
                    'WNW': () => (this.checkBounds(file - 2, rank + 1, piece)),
                    'NWN': () => (this.checkBounds(file - 1, rank + 2, piece))
                }

                const isKnight = (piece.getType() === 'n' || piece.getType() === 'N')
                currentMove = 1;

                if (isKnight) { 
                    if (knightMoveDirections[cardinal]()) { return; }
                    return;
                }
                
                while (currentMove <= step) {
                    if (generalMoveDirections[cardinal]()) { return; }
                    currentMove++;
                }
            })
        }
    }

    checkBounds(file: number, rank: number, piece: IPiece) {
        const squaresArray = this.chessBoard.getSquaresArray();
        const files = this.chessBoard.getFiles();
        
        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].getPosition() === (files[file] + rank)) {
                if (!squaresArray[i].squareContainsPiece()) {
                    if (piece.getType() === 'P' || piece.getType() === 'p') {
                        if (squaresArray[i].getPosition()[0] === piece.getPosition()[0]) {
                            this.validMoves.push(squaresArray[i]);
                        }
                        return;
                    }
                    this.validMoves.push(squaresArray[i])
                    return false
                }
                if (piece.getColour() === squaresArray[i].getPiece().colour) {
                    return true;
                }
                if (piece.getType() === 'P' || piece.getType() === 'p') {
                    if (piece.colour === squaresArray[i].getPiece().colour) {
                        return true;
                    }
                    if (piece.getPosition()[0] === squaresArray[i].getPosition()[0]) {
                        return true;
                    }
                }
                this.validMoves.push(squaresArray[i])
                return true
            }
        }
    }

    checkRequestedMove(squares: Square) {
        for (let i = 0; i < this.validMoves.length; i++) {
            if (this.validMoves[i].getPosition() === squares.getPosition()) {
                return true;
            }
        }
        return false;
    }

    incrementMoveCount(piece: IPiece) { piece.incrementMoveNumber(1); }

    getNextMove() { return (this.gameState.getCurrentTurn() === "White" ? ("Black") : ("White")); }

    getChessboard() { return this.chessBoard; }

    getSquareActive() { return this.isSquareClicked; }
 
    getValidMoves() { return this.validMoves; }

    getGameState() { return this.gameState; }

    getCurrentPlayer() { return this.currentPlayer; }

    setChessboard(board: Board) { this.chessBoard = board; }

    setSquareActive(active: boolean) { this.isSquareClicked = active; }

    setValidMoves(valid: Array<Square>) { this.validMoves = valid; }

}

export default Game;
