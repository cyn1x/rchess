import { IPiece } from './pieces/types';

import GameState from './GameState';
import GameLogic from './GameLogic';
import PiecesFactory from './PiecesFactory';
import Board from './Board';
import Square from './Square';
import Player from './Player';

class Game {
    private gameState: GameState;
    private gameLogic: GameLogic;
    private chessboard: Board;
    private isSquareClicked: boolean;
    private player!: Player;

    constructor(player: string, fen: string, turn: string) {
        this.gameState = new GameState();
        this.chessboard = new Board();
        this.setPlayer(player);
        this.gameLogic = new GameLogic(this.chessboard, this.player);
        this.isSquareClicked = false;

        this.gameState.setFenString(fen);
        this.gameState.setCurrentTurn(turn);
    }

    setPlayer(player: string) {
        if (player === "Demo") {
            this.player = new Player("White");
            this.player.setDemonstrationMode();
            return;
        }
        
        player === "Player 1" ? this.player = new Player("White") : this.player = new Player("Black");
    }

    switchPlayerForDemonstrationMode() {
        this.player.getColour() === "White" ? this.player.setColour("Black") : this.player.setColour("White");
        this.player.setDemonstrationMode();
        this.player.setCheckStatus(false);
    }
    
    initialise(cw: number, ch: number) {
        const files = this.chessboard.getFiles();
        const ranks = this.chessboard.getRanks();
        let squaresArray = this.chessboard.getSquaresArray();
        for (let i = 0; i < files.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                squaresArray[i + j * 8] = new Square(files[i] + ranks[j], i * cw, j * cw, cw, ch);
            }
        }
        this.chessboard.setSquaresArray(squaresArray);
        this.setPiecePositions();
    }

    updateGameState(gameProps: any) {
        const squaresArray = this.chessboard.getSquaresArray();
        
        if (gameProps.nextPlayerTurn !== this.gameState.getCurrentTurn()) {
            for (let i = 0; i < squaresArray.length; i++) {
                if (squaresArray[i].getPosition() === gameProps.movePieceFrom) {
                    this.chessboard.setActiveSquare(squaresArray[i]);
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
        const files = this.chessboard.getFiles();
        const ranks = this.chessboard.getRanks();
        let squaresArray = this.chessboard.getSquaresArray();
        for (let i = 0; i < files.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                squaresArray[i + j * 8].setX(i * cw);
                squaresArray[i + j * 8].setY(j * cw);
                squaresArray[i + j * 8].setWidth(cw);
                squaresArray[i + j * 8].setHeight(ch);
            }
        }
        this.chessboard.setSquaresArray(squaresArray);
    }

    setPiecePositions() {
        const piecesFactory = new PiecesFactory();
        const startingFen = this.gameState.getFenString();
        const squaresArray = this.chessboard.getSquaresArray();
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
                    newPiece.setStartingSquare(squaresArray[index]);
                    squaresArray[index].setPiece(newPiece);
                }
            })
        })
    }

    fenParser(fen: string) {
        const fenString = fen.split(" ");
        const positions = fenString[0].split("/");
        const pieces = this.chessboard.getPiecePositionsArray();

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
        const fenPositions = this.createFenPositions();
        const newFenString = this.appendFenState(fenPositions);

        return newFenString;
    }

    createFenPositions() {
        const board = this.getChessboard().getSquaresArray();
        let newFenString = "";
        let emptySquares = 0;
        for (let i = 0; i < board.length; i++) {
            
            if (i % 8 === 0 && i !== 0) {
                newFenString += "/"
                emptySquares = 0;
            }
            
            if (board[i].bSquareContainsPiece()) {
                newFenString += board[i].getPiece().getType();
                emptySquares = 0;
            } else {
                emptySquares++;
                if ((i + 1) < board.length) {
                    if ((i + 1) % 8 === 0) {
                        newFenString += emptySquares;
                    }
                    else if (board[i + 1].bSquareContainsPiece()) {
                        newFenString += emptySquares;
                    }
                }
            }
        }
        return newFenString;
    }

    appendFenState(newFenString: string) {
        const currentTurn = this.gameState.getCurrentTurn();
        currentTurn[0] === 'W' ? newFenString += " w " : newFenString += " b ";

        return newFenString;
    }

    handleActivatedSquare(activeSquare: Square) {
        this.setSquareActive(true);
        this.chessboard.setActiveSquare(activeSquare);
    }

    handleDeactivatedSquare() {
        const emptySquare = new Square('0', 0, 0, 0, 0);
        
        this.chessboard.setActiveSquare(emptySquare);
        this.setSquareActive(false);
    }

    handleOverwriteSquare(activeSquare: Square, activePiece: IPiece) {        
        this.chessboard.getActiveSquare().removePiece();
        this.chessboard.setActiveSquare(activeSquare);
        this.incrementMoveCount(activePiece);
        activeSquare.setPiece(activePiece);
    }
    
    postMoveCalculations() {
        const squaresArray = this.chessboard.getSquaresArray();
        if (this.player.bIsDemonstrationMode() && this.player.bHasCompletedTurn()) {
            this.switchPlayerForDemonstrationMode();
        }

        this.gameLogic.determineAttackedSquares();
        this.gameLogic.clearAttackedSquares();
        this.setPlayerCompletedTurn(false);
    }

    bIsDemonstrationMode() { return this.player.bIsDemonstrationMode(); }

    checkRequestedMove(squares: Square) { return this.gameLogic.checkRequestedMove(squares); }

    checkValidMoves(pos: string, piece: IPiece) { this.gameLogic.squareContainsAttack(pos, piece); }

    incrementMoveCount(piece: IPiece) { piece.incrementMoveCount(); }

    clearAttackedSquares() { this.gameLogic.clearAttackedSquares(); }

    getNextMove() { return (this.gameState.getCurrentTurn() === "White" ? "Black" : "White"); }

    getChessboard() { return this.chessboard; }

    getSquareActive() { return this.isSquareClicked; }
 
    getAttackedSquares() { return this.gameLogic.getAttackedSquares(); }

    getGameState() { return this.gameState; }

    getCurrentPlayer() { return this.player; }

    setChessboard(board: Board) { this.chessboard = board; }

    setSquareActive(active: boolean) { this.isSquareClicked = active; }

    setPlayerCompletedTurn(completed: boolean) { this.player.setTurnComplete(completed); }

}

export default Game;
