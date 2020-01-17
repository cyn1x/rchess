import { IPiece } from '../entities/pieces/types';

import GameData from '../GameData';
import Board from '../entities/Board';
import SpecialMoves from './SpecialMoves';
import Square from '../entities/Square';
import Player from '../entities/Player';
import King from '../entities/pieces/King';
import Rook from '../entities/pieces/Rook';
import Pawn from '../entities/pieces/Pawn';

class GameLogic implements Logic {
    private gameData: GameData;
    private chessboard: Board;
    private specialMoves: SpecialMoves;
    private player!: Player;
    private bVerifyingBoardState: boolean;
    private bVerifyingRequestedMove: boolean;

    constructor(gameData: GameData, chessboard: Board) {
        this.gameData = gameData;
        this.chessboard = chessboard;
        this.specialMoves = new SpecialMoves(this.gameData, this.chessboard);
        this.bVerifyingBoardState = false;
        this.bVerifyingRequestedMove = false;
    }

    checkRequestedMove(attackedSquare: Square) {
        const attackedSquares = this.gameData.getAttackedSquares();

        for (let i = 0; i < attackedSquares.length; i++) {
            if (attackedSquares[i].getPosition() === attackedSquare.getPosition()) {
                this.verifyRequestedMove(attackedSquare);

                return !this.player.bIsInCheck();
            }
        }
    }

    checkSpecialMove(specialMoveSquare: Square) {
        if (specialMoveSquare.bIsCastlingSquare()) {
            const westCastlingSquare = this.chessboard.getWestCastlingSquare();
            const eastCastlingSquare = this.chessboard.getEastCastlingSquare();

            switch(specialMoveSquare) {
                case this.chessboard.getWestCastlingSquare():
                    return westCastlingSquare;
                case this.chessboard.getEastCastlingSquare():
                    return eastCastlingSquare;
            }
        }
        if (specialMoveSquare.bIsEnPassantSquare()) {
            const enPassantSquare = this.chessboard.getEnPassantSquare();

            return enPassantSquare;
        }
    }

    checkMoveSideEffects(activeSquare: Square, attackedSquare: Square) {
        const activePiece = activeSquare.getPiece();

        switch(true) {
            case activePiece instanceof Pawn:
                this.specialMoves.enPassantOpeningDeterminant(attackedSquare);
                break;
            case activePiece instanceof Rook:
                this.specialMoves.rookCanCastleDeterminant(this.player);
                break;
            case activePiece instanceof King:
                this.specialMoves.kingCanCastleDeterminant(this.player);
                break;
        }
    }

    squareContainsAttack(pos: string, piece: IPiece) {
        if (this.bIsVerifyingRequestedMove() || this.bIsVerifyingNewBoardState()) {
            this.determineMoveCase(pos, piece);
            return;
        }
        
        this.determineMoveCase(pos, piece);
        
        if (this.bIsKing(piece)) {
            this.playerCanCastleDeterminant(piece);
        }
        else if (this.bIsPawn(piece)) {
            this.specialMoves.enPassantCaptureDeteriminant(piece);
        }
    }
    
    determineMoveCase(pos: string, piece: IPiece) {
        if (this.bIsKnight(piece)) {
            this.knightSpecialCases(pos, piece);
            return;
        }
        
        this.generalMoveCases(pos, piece);
    }

    generalMoveCases(pos: string, piece: IPiece) {
        const files = this.chessboard.getFiles();
        const pieceMoveDirections = piece.getMoveDirections();

        const file = files.indexOf(pos[0]);
        const rank = Number(pos[1]);

        const moveDirections: any = {
            'N': () => (this.checkAttackableSquares(file, rank + currentMove, piece)),
            'S': () => (this.checkAttackableSquares(file, rank - currentMove, piece)),
            'E': () => (this.checkAttackableSquares(file + currentMove, rank, piece)),
            'W': () => (this.checkAttackableSquares(file - currentMove, rank, piece)),
            'NE': () => (this.checkAttackableSquares(file + currentMove, rank + currentMove, piece)),
            'SE': () => (this.checkAttackableSquares(file + currentMove, rank - currentMove, piece)),
            'NW': () => (this.checkAttackableSquares(file - currentMove, rank + currentMove, piece)),
            'SW': () => (this.checkAttackableSquares(file - currentMove, rank - currentMove, piece))
        }

        let currentMove = 0;
        pieceMoveDirections.forEach( (totalMoveCount: number, cardinalDirection: string) => {

            currentMove = 1;
            while (currentMove <= totalMoveCount) {
                if (!moveDirections[cardinalDirection]()) { return; }
                currentMove++;
            }
        })
    }

    knightSpecialCases(pos: string, piece: IPiece) {
        const files = this.chessboard.getFiles();
        const pieceMoves = piece.getMoveDirections();

        const file = files.indexOf(pos[0]);
        const rank = Number(pos[1]);

        const moveDirections: any = {
            'NNE': () => (this.checkAttackableSquares(file + 1, rank + 2, piece)),
            'ENE': () => (this.checkAttackableSquares(file + 2, rank + 1, piece)),
            'ESE': () => (this.checkAttackableSquares(file + 2, rank - 1, piece)),
            'SSE': () => (this.checkAttackableSquares(file + 1, rank - 2, piece)),
            'SSW': () => (this.checkAttackableSquares(file - 1, rank - 2, piece)),
            'WSW': () => (this.checkAttackableSquares(file - 2, rank - 1, piece)),
            'WNW': () => (this.checkAttackableSquares(file - 2, rank + 1, piece)),
            'NWN': () => (this.checkAttackableSquares(file - 1, rank + 2, piece))
        }

        pieceMoves.forEach( (totalMoveCount: number, cardinalDirection: string) => {
            if (!moveDirections[cardinalDirection]()) { return; }
        })
    }

    checkAttackableSquares(file: number, rank: number, piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();
        const files = this.chessboard.getFiles();
        const attackedSquareIndex = this.calculateArrayIndex(file, rank);
        
        if (attackedSquareIndex < 0 || attackedSquareIndex > squaresArray.length - 1) { return; }

        if (squaresArray[attackedSquareIndex].getPosition() === (files[file] + rank)) {
            return this.checkSquareContainsPiece(piece, attackedSquareIndex);
        }
    }

    checkSquareContainsPiece(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();

        if (!squaresArray[attackedSquareIndex].bSquareContainsPiece()) {
            return this.bAttackUnoccupiedSquares(piece, attackedSquareIndex);
        }
        else { this.playerInCheckDeterminant(piece, attackedSquareIndex); }
        
        return this.bAttackOccupiedSquares(piece, attackedSquareIndex);
    }

    playerInCheckDeterminant(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const attackedPiece = squaresArray[attackedSquareIndex].getPiece();
        
        if (this.bIsKing(attackedPiece) && this.bKingInCheck(piece, attackedPiece)) {
            this.player.setCheckStatus(true);
        }
    }

    bAttackUnoccupiedSquares(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const attackedSquares = this.gameData.getAttackedSquares();

        if (this.bIsPawn(piece) && !this.bPawnCanAttack(squaresArray[attackedSquareIndex], piece)) {
            this.setSquareAttack(attackedSquareIndex, piece);
            return false;
        }
        else {
            if (!this.bIsPawn(piece)) { this.setSquareAttack(attackedSquareIndex, piece); }
        }
        if (this.bIsKing(piece)) {
            const attackingPieces = squaresArray[attackedSquareIndex].getAttackingPiece();
            for (let i = 0; i < attackingPieces.length; i++) {
                if (attackingPieces[i].getColour() !== piece.getColour()) { return; }
            }
        }
        attackedSquares.push(squaresArray[attackedSquareIndex]);
        return true;
    }

    bAttackOccupiedSquares(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const attackedSquares = this.gameData.getAttackedSquares();
        
        if (piece.getColour() === squaresArray[attackedSquareIndex].getPiece().getColour()) {
            this.setSquareAttack(attackedSquareIndex, piece);
            return false;
        }
        if (this.bIsPawn(piece)) {
            if (this.bPawnCanAttack(squaresArray[attackedSquareIndex], piece)) {
                return true;
            }
            else { this.setSquareAttack(attackedSquareIndex, piece); }
        }
        else { this.setSquareAttack(attackedSquareIndex, piece); }

        if (this.bIsKing(squaresArray[attackedSquareIndex].getPiece())) {
            return false;
        }
        
        if (this.bIsKing(piece)) {
            const attackingPieces = squaresArray[attackedSquareIndex].getAttackingPiece();
            for (let i = 0; i < attackingPieces.length; i++) {
                if (attackingPieces[i].getColour() !== piece.getColour()) { return; }
            }
        }
        attackedSquares.push(squaresArray[attackedSquareIndex]);
        return false;
    }

    setSquareAttack(attackedSquare: number, piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();

        squaresArray[attackedSquare].setSquareAttacked(true);
        squaresArray[attackedSquare].setAttackingPiece(piece);
    }

    determineAttackedSquares() {
        const squaresArray = this.chessboard.getSquaresArray();
        
        this.setVerifyingNewBoardState(true);

        for (let i = 0; i < squaresArray.length; i++) {
            squaresArray[i].setSquareAttacked(false);
            squaresArray[i].clearAttackingPieces();
        }
        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].bSquareContainsPiece()) {
                this.squareContainsAttack(squaresArray[i].getPosition(), squaresArray[i].getPiece());
            }
        }

        this.setVerifyingNewBoardState(false);
    }

    verifyRequestedMove(attackedSquare: Square) {
        if (this.player.bIsInCheck()) {
            this.player.setCheckStatus(false);
        }

        const squaresArray = this.chessboard.getSquaresArray();
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();
        const defendingPiece = attackedSquare.getPiece();

        activeSquare.removePiece();
        this.chessboard.setActiveSquare(attackedSquare);
        attackedSquare.setPiece(activePiece);
        this.setVerifyingMove(true);
        this.gameData.clearAttackedSquares();

        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].bSquareContainsPiece()) {
                this.squareContainsAttack(squaresArray[i].getPosition(), squaresArray[i].getPiece());
            }
        }

        this.gameData.clearAttackedSquares();
        attackedSquare.removePiece();
        activeSquare.setPiece(activePiece);

        if (defendingPiece) { 
            attackedSquare.setPiece(defendingPiece);
        }

        this.chessboard.setActiveSquare(activeSquare);
        this.setVerifyingMove(false);
        this.squareContainsAttack(activePiece.getPosition(), activePiece);
    }

    playerCanCastleDeterminant(piece: IPiece) {
        if (piece instanceof King) {

            if (!piece.bCanCastle() || piece.bIsInCheck()) { return; }
            if (piece.getStartingSquare().getPosition() !== piece.getPosition()) { return; }

            this.specialMoves.westCastlingDeterminant(piece.getPosition());
            this.specialMoves.eastCastlingDeterminant(piece.getPosition());
        }
    }

    performEnPassantCapture(captureSquare: Square) {
        return this.specialMoves.performEnPassantCapture(captureSquare);
    }

    determineEnPassantSquare(squarePosition: string) {
        return this.specialMoves.determineEnPassantSquare(squarePosition);
    }

    castleRookQueenSide(queenSideSquare: Square) {
        return this.specialMoves.castleRookQueenSide(queenSideSquare);
    }

    castleRookKingSide(kingSideSquare: Square) {
        return this.specialMoves.castleRookKingSide(kingSideSquare);
    }

    calculateArrayIndex(file: number, rank: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const boardLength = squaresArray.length / 8;

        return (boardLength - rank) * boardLength + file;
    }

    bKingInCheck(piece: IPiece, attackedPiece: IPiece) {
        if (this.bIsPawn(piece) && piece.getPosition()[0] === attackedPiece.getPosition()[0]) {
            return;
        }

        return (piece.getColour() !== attackedPiece.getColour() && this.player.getColour() === attackedPiece.getColour());
    }

    bIsPawn(piece: IPiece) { return piece.getType() === 'P' || piece.getType() === 'p'; }

    bIsBishop(piece: IPiece) { return piece.getType() === 'B' || piece.getType() === 'b'; }

    bIsKnight(piece: IPiece) { return piece.getType() === 'N' || piece.getType() === 'n'; }

    bIsRook(piece: IPiece) { return piece.getType() === 'R' || piece.getType() === 'r'; }

    bisQueen(piece: IPiece) { return piece.getType() === 'Q' || piece.getType() === 'q'; }
    
    bIsKing(piece: IPiece) { return piece.getType() === 'K' || piece.getType() === 'k'; }

    bIsVerifyingRequestedMove() { return this.bVerifyingRequestedMove; }
    
    bIsVerifyingNewBoardState() { return this.bVerifyingBoardState; }

    bPawnCanAttack(square: Square, piece: IPiece) { return square.getPosition()[0] === piece.getPosition()[0]; }

    setVerifyingMove(verifying: boolean) { this.bVerifyingRequestedMove = verifying; }

    setPlayerForMoveValidation(player: Player) { this.player = player; }

    setVerifyingNewBoardState(verifying: boolean) { this.bVerifyingBoardState = verifying; }
    
}

export default GameLogic;
