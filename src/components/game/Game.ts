import { IGameState } from '../types';
import { IPiece } from './entities/pieces/types';

import GameData from './GameData';
import GameState from './GameState';
import GameLogic from './logic/GameLogic';
import FenParser from './fen/FenParser';
import FenBuilder from './fen/FenBuilder';
import PiecesFactory from './entities/pieces/PiecesFactory';
import Board from './entities/Board';
import Square from './entities/Square';
import Player from './entities/Player';
import Pawn from './entities/pieces/Pawn';
import King from './entities/pieces/King';

class Game {
    private gameData: GameData;
    private gameState: GameState;
    private gameLogic: GameLogic;
    private chessboard: Board;
    private player!: Player;

    private specialMoveSquare!: Square;
    private isSquareClicked: boolean;
    private specialMoveInProgress: boolean;
    private pawnisBeingMoved: boolean;
    private pieceIsBeingCaptured: boolean;
    private gameOver: boolean;

    constructor(player: string, fen: string, turn: string) {
        this.setPlayer(player, turn);

        this.gameData = new GameData;
        this.gameState = new GameState();
        this.chessboard = new Board();
        this.gameLogic = new GameLogic(this.gameData, this.chessboard);
        this.isSquareClicked = false;
        this.specialMoveInProgress = false;
        this.pawnisBeingMoved = false;
        this.pieceIsBeingCaptured = false;
        this.gameOver = false;

        this.setGameState(fen, turn);
    }

    setGameState(fen: string, turn: string) {
        const defaultState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        const fenString = fen.split(" ").length === 6 ? fen : defaultState;

        this.gameState.setFenString(fenString);
        this.gameState.setCurrentTurn(turn);
        this.setPlayerCastlingState(fenString);
        this.gameState.setHalfmoveClock(Number(fen.split(" ")[4]));
        this.gameState.setFullmoveClock(Number(fen.split(" ")[5]));
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

    updateGameState(gameProps: IGameState) {
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
                    this.gameState.setHalfmoveClock(Number(gameProps.nextFenString.split(" ")[4]));
                    this.gameState.setFullmoveClock(Number(gameProps.nextFenString.split(" ")[5]));

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
        const fenParser = new FenParser(this.chessboard);
        const piecesFactory = new PiecesFactory();
        const startingFen = this.gameState.getFenString();
        const squaresArray = this.chessboard.getSquaresArray();
        const piecesArray = fenParser.parseFenString(startingFen);

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

    createFenString() {
        const fenBuilder = new FenBuilder(this.gameState, this.chessboard, this.player);

        const positions = fenBuilder.createFenPositions();
        const currentTurn = fenBuilder.createFenCurrentTurn();
        const castling = fenBuilder.createFenCastlingStatus();
        const enPassant = fenBuilder.createFenEnPassantSquare();
        const halfmoveClock = fenBuilder.createFenHalfmoveClock();
        const fullmoveClock = fenBuilder.createFenFullmoveClock();

        const newFenString = positions + currentTurn + castling + enPassant + halfmoveClock + fullmoveClock;

        return newFenString;
    }

    setPlayerCastlingState(fen: string) {
        const fenCastling = fen.split(" ")[2];

        if (fenCastling.length === 0) {
            return "-";
        }
        
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
        if (activeSquare.getPiece()) {
            this.gameData.setCapturedPiece(activeSquare.getPiece());
        }

        this.chessboard.getActiveSquare().removePiece(); 
        this.chessboard.setActiveSquare(activeSquare);
        activeSquare.setPiece(activePiece);
    }

    preMoveProcessing(attackedSquare: Square) {
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();

        this.chessboard.clearSpecialSquares();
        this.gameLogic.checkMoveSideEffects(activeSquare, attackedSquare);
        this.incrementMoveCount(activePiece);

        this.fiftyMoveRuleDeterminant(attackedSquare, activePiece);
        this.fiftyMoveRuleProcessing();
        this.fullMoveClockProcessing();
    }

    postMoveProcessing() {
        if (this.gameState.getHalfmoveClock() === 50) {
            this.setGameOver(true);
        }
    }

    fiftyMoveRuleDeterminant(attackedSquare: Square, activePiece: IPiece) {
        if (attackedSquare.bSquareContainsPiece()) {
            this.setPieceIsBeingCaptured(true);
        }
        else if (activePiece instanceof Pawn) {
            this.setPawnIsBeingMoved(true);
        }
    }

    fiftyMoveRuleProcessing() {
        if (!this.bPawnIsBeingMoved() && !this.bPieceIsBeingCaptured()) {
            const halfmoveClock = this.gameState.getHalfmoveClock();
            this.gameState.setHalfmoveClock(halfmoveClock + 1);

            return;
        }
        
        this.gameState.setHalfmoveClock(0);
        this.setPawnIsBeingMoved(false);
        this.setPieceIsBeingCaptured(false);
    }

    fullMoveClockProcessing() {
        if (this.player.getColour() === "White" && this.gameState.getFullmoveClock() === 1) { return; }

        const fullmoveClock = this.gameState.getFullmoveClock();

        this.gameState.setFullmoveClock(fullmoveClock + 1);
    }

    determinePlayerSpecialMoveCase(square: Square) {
        const activePiece = this.chessboard.getActiveSquare().getPiece();
        if (activePiece instanceof King) {
            if (square === this.chessboard.getWestCastlingSquare()) {
                this.initiateCastling();
                return;
            }
            if (square === this.chessboard.getEastCastlingSquare()) {
                this.initiateCastling();
                return;
            }
        }
        if (activePiece instanceof Pawn) {
            if (square === this.chessboard.getEnPassantSquare()) {
                this.initiateEnPassantCapture();
                return;
            }
        }
        this.setSpecialMoveInProgress(false);
    }

    initiateCastling() {
        this.player.setCanCastledKingSide(false);
        this.player.setCanCastledQueenSide(false);
        this.setSpecialMoveInProgress(true);
    }

    initiateEnPassantCapture() {
        this.setSpecialMoveInProgress(true);
    }

    checkValidMoves(pos: string, piece: IPiece) {
        this.gameLogic.setPlayerForMoveValidation(this.player);
        this.gameLogic.squareContainsAttack(pos, piece);
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
            if (specialMoveSquare.bIsEnPassantSquare()) {
                this.performEnPassantCapture(specialMoveSquare);
            }
        }
    }

    performEnPassantCapture(square: Square) {
        const capturedEnPassantSquare = this.gameLogic.performEnPassantCapture(square);

        this.setSpecialMoveSquare(capturedEnPassantSquare);
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
        this.gameData.clearAttackedSquares();
        this.setPlayerCompletedTurn(false);
    }

    incrementMoveCount(piece: IPiece) { piece.incrementMoveCount(); }

    removeSpecialSquare() { delete this.specialMoveSquare; }

    clearAttackedSquares() { this.gameData.clearAttackedSquares(); }

    bIsDemonstrationMode() { return this.player.bIsDemonstrationMode(); }

    bIsMultiplayerGame(nextPlayerTurn: string) { return nextPlayerTurn === this.getCurrentPlayer().getColour(); }

    bRequestedMoveIsValid(squares: Square) { return this.gameLogic.checkRequestedMove(squares); }

    bSquareIsActive() { return this.isSquareClicked; }

    bSpecialMoveInProgress() { return this.specialMoveInProgress; }

    bPawnIsBeingMoved() { return this.pawnisBeingMoved; }

    bPieceIsBeingCaptured() { return this.pieceIsBeingCaptured; }

    bGameIsOver() { return this.gameOver; }

    getNextMove() { return (this.gameState.getCurrentTurn() === "White" ? "Black" : "White"); }
 
    getAttackedSquares() { return this.gameData.getAttackedSquares(); }

    getGameState() { return this.gameState; }

    getChessboard() { return this.chessboard; }

    getCurrentPlayer() { return this.player; }

    getSpecialMoveSquare() { return this.specialMoveSquare; }

    setSpecialMoveSquare(move: Square) { this.specialMoveSquare = move; }

    setSquareActive(active: boolean) { this.isSquareClicked = active; }

    setSpecialMoveInProgress(moving: boolean) { this.specialMoveInProgress = moving; }

    setPawnIsBeingMoved(moving: boolean) { this.pawnisBeingMoved = moving; }

    setPieceIsBeingCaptured(captured: boolean) { this.pieceIsBeingCaptured = captured; }

    setPlayerCompletedTurn(completed: boolean) { this.player.setTurnComplete(completed); }

    setGameOver(gameOver: boolean) { this.gameOver = gameOver; }

}

export default Game;
