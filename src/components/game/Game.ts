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
    private player!: Player;
    private isSquareClicked: boolean;
    private specialMoveInProgress: boolean;
    private specialMoveSquare!: Square;
    private halfmoveClock!: number;
    private fullmoveClock!: number;

    constructor(player: string, fen: string, turn: string) {
        this.setPlayer(player, turn);
        this.gameState = new GameState();
        this.chessboard = new Board();
        this.gameLogic = new GameLogic(this.chessboard, this.player);
        this.isSquareClicked = false;
        this.specialMoveInProgress = false;

        this.gameState.setCurrentTurn(turn);
        this.setPlayerCastlingState(fen);
        this.setMoveClocks(fen);
        this.gameState.setFenString(fen);
    }

    setPlayer(player: string, turn: string) {
        if (player === "Demo") {
            this.player = new Player(turn);
            this.player.setDemonstrationMode();
            return;
        }
        
        player === "Player 1" ? this.player = new Player("White") : this.player = new Player("Black");
    }

    switchPlayerForDemonstrationMode() {
        this.player.getColour() === "White" ? this.player.setColour("Black") : this.player.setColour("White");
        this.player.setDemonstrationMode();
        this.player.setCheckStatus(false);
        this.setCastlingStatusforDemoMode();
    }

    setCastlingStatusforDemoMode() {
        this.player.setCanCastledKingSide(false);
        this.player.setCanCastledQueenSide(false);
        this.setPlayerCastlingState(this.gameState.getFenString());
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
        const positions = this.createFenPositions();
        const currentTurn = this.createFenCurrentTurn();
        const castling = this.createFenCastlingStatus();
        const enPassant = this.createFenEnPassantSquare();
        const halfmoveClock = this.createFenHalfmoveClock();
        const fullmoveClock = this.createFenFullmoveClock();

        const newFenString = positions + currentTurn + castling + enPassant + halfmoveClock + fullmoveClock;

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
            }
            else {
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

    createFenCurrentTurn() {
        const currentTurn = this.gameState.getCurrentTurn();
        const fenCurrentTurn = (currentTurn[0] === "W" ? " w " : " b ");

        return fenCurrentTurn;
    }

    createFenCastlingStatus() {
        let fenCastlingState = "";

        if (this.player.getColour() === "White") {
            if (this.player.bCanCastleKingSide()) {
                fenCastlingState += "K";
            }
            if (this.player.bCanCastleQueenSide()) {
                fenCastlingState += "Q";
            }
            this.gameState.getFenCastlingState().split("").forEach(char => {
                switch(char) {
                    case "k": fenCastlingState += char;
                        break;
                    case "q": fenCastlingState += char;
                        break;
                }
            })
        }
        else if (this.player.getColour() === "Black") {
            this.gameState.getFenCastlingState().split("").forEach(char => {
                switch(char) {
                    case "K": fenCastlingState += char;
                        break;
                    case "Q": fenCastlingState += char;
                        break;
                }
            })
            if (this.player.bCanCastleKingSide()) {
                fenCastlingState += "k";
            }
            if (this.player.bCanCastleQueenSide()) {
                fenCastlingState += "q";
            }
        }

        if (fenCastlingState.length === 0) { fenCastlingState += "-"; }

        this.gameState.setFenCastlingState(fenCastlingState);

        return fenCastlingState;
    }

    createFenEnPassantSquare() {
        const enPassantSquare = this.chessboard.getEnPassantSquare();
        const fenEnPassantSquare = (enPassantSquare ? " " + enPassantSquare.getPosition() + " " : " - ")

        return fenEnPassantSquare;
    }

    createFenHalfmoveClock() { return " " + this.getHalfmoveClock() + " "; }

    createFenFullmoveClock() { return " " + this.getFullmoveClock(); }

    setPlayerCastlingState(fen: string) {
        let fenCastling = "";

        if (fen.length === 0) { fenCastling += this.gameState.getFenString(); }
        else { fenCastling = fen.split(" ")[2]; }

        if (fenCastling.length === 0) { return "-"; }
        
        let newFenCastlingState = "";

        fenCastling.split("").forEach((char: string) => {
            switch(char) {
                case "K":
                    this.setPlayerCanCastleKingSide(char);
                    newFenCastlingState += char;
                    break;
                case "Q":
                    this.setPlayerCanCastleQueenSide(char)
                    newFenCastlingState += char;
                    break;
                case "k":
                    this.setPlayerCanCastleKingSide(char);
                    newFenCastlingState += char;
                    break;
                case "q":
                    this.setPlayerCanCastleQueenSide(char);
                    newFenCastlingState += char;
                    break;
            }
        })

        this.gameState.setFenCastlingState(newFenCastlingState);
    }

    setPlayerCanCastleKingSide(kingSide: string) {
        if (this.player.getColour() === "White" && kingSide === "K") {
            this.player.setCanCastledKingSide(true);
        }
        else if (this.player.getColour() === "Black" && kingSide === "k") {
            this.player.setCanCastledKingSide(true);
        }
    }

    setPlayerCanCastleQueenSide(kingSide: string) {
        if (this.player.getColour() === "White" && kingSide === "Q") {
            this.player.setCanCastledQueenSide(true);
        }
        else if (this.player.getColour() === "Black" && kingSide === "q") {
            this.player.setCanCastledQueenSide(true);
        }
    }

    setMoveClocks(fen: string) {
        this.halfmoveClock = Number(fen.split(" ")[4]);
        this.fullmoveClock = Number(fen.split(" ")[5]);
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
        activeSquare.setPiece(activePiece);
    }

    beforeMoveProcessing(attackedSquare: Square) {
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();

        this.chessboard.clearSpecialSquares();
        this.gameLogic.checkMoveSideEffects(activeSquare, attackedSquare);
        this.incrementMoveCount(activePiece);
        this.incrementFullmoveClock();
    }

    determinePlayerSpecialMoveCase(square: Square) {
        const activePiece = this.chessboard.getActiveSquare().getPiece();
        if (this.gameLogic.bIsKing(activePiece)) {
            if (square === this.chessboard.getWestCastlingSquare()) {
                this.initiateCastling();
                return;
            }
            if (square === this.chessboard.getEastCastlingSquare()) {
                this.initiateCastling();
                return;
            }
        }
        if (this.gameLogic.bIsPawn(activePiece)) {
            
        }
        this.setSpecialMoveInProgress(false);
    }

    initiateCastling() {
        this.player.setCanCastledKingSide(false);
        this.player.setCanCastledQueenSide(false);
        this.setSpecialMoveInProgress(true);
        this.createFenCastlingStatus();
    }

    checkSpecialMoves(square: Square) {
        const specialMoveSquare = this.gameLogic.checkSpecialMove(square);
        
        if (specialMoveSquare) {
            if (specialMoveSquare.bIsCastlingSquare()) {
                if (specialMoveSquare === this.chessboard.getWestCastlingSquare()) {
                    this.castleRookQueenSide(specialMoveSquare);
                }
                else if (specialMoveSquare === this.chessboard.getEastCastlingSquare()) {
                    this.castleRookKingSide(specialMoveSquare);
                }
            }
        }
    }

    castleRookQueenSide(square: Square) {
        const squaresArray = this.chessboard.getSquaresArray();
        const queenSideRookSquareIndex = this.gameLogic.castleRookQueenSide(square);

        this.setSpecialMoveSquare(squaresArray[queenSideRookSquareIndex]);
    }

    castleRookKingSide(square: Square) {
        const squaresArray = this.chessboard.getSquaresArray();
        const kingSideRookSquareIndex = this.gameLogic.castleRookKingSide(square);

        this.setSpecialMoveSquare(squaresArray[kingSideRookSquareIndex]);
    }
    
    postMoveCalculations() {
        if (this.player.bIsDemonstrationMode() && this.player.bHasCompletedTurn()) {
            this.switchPlayerForDemonstrationMode();
        }

        const enPassantSquare = this.gameState.getFenString().split(" ")[3];

        this.gameLogic.determineEnPassantSquare(enPassantSquare);
        this.gameLogic.determineAttackedSquares();
        this.gameLogic.clearAttackedSquares();
        this.setPlayerCompletedTurn(false);
    }

    incrementHalfmoveClock() { this.halfmoveClock += 1; }

    incrementFullmoveClock() { this.fullmoveClock += 1; }

    bIsDemonstrationMode() { return this.player.bIsDemonstrationMode(); }

    bRequestedMoveIsValid(squares: Square) { return this.gameLogic.checkRequestedMove(squares); }

    bSquareIsActive() { return this.isSquareClicked; }

    bSpecialMoveInProgress() { return this.specialMoveInProgress; }

    checkValidMoves(pos: string, piece: IPiece) { this.gameLogic.squareContainsAttack(pos, piece); }

    incrementMoveCount(piece: IPiece) { piece.incrementMoveCount(); }

    clearAttackedSquares() { this.gameLogic.clearAttackedSquares(); }

    removeSpecialSquare() { delete this.specialMoveSquare; }

    getNextMove() { return (this.gameState.getCurrentTurn() === "White" ? "Black" : "White"); }

    getChessboard() { return this.chessboard; }
 
    getAttackedSquares() { return this.gameLogic.getAttackedSquares(); }

    getGameState() { return this.gameState; }

    getCurrentPlayer() { return this.player; }

    getSpecialMoveSquare() { return this.specialMoveSquare; }

    getHalfmoveClock() { return this.halfmoveClock; }

    getFullmoveClock() { return this.fullmoveClock; }

    setSquareActive(active: boolean) { this.isSquareClicked = active; }

    setPlayerCompletedTurn(completed: boolean) { this.player.setTurnComplete(completed); }

    setSpecialMoveInProgress(moving: boolean) { this.specialMoveInProgress = moving; }

    setSpecialMoveSquare(move: Square) { this.specialMoveSquare = move; }

}

export default Game;
