import { IPiece } from '../entities/pieces/types';

import GameData from '../GameData';
import Board from '../entities/Board';
import SpecialMoveHandler from './SpecialMoveHandler';
import Square from '../entities/Square';
import Player from '../entities/Player';
import King from '../entities/pieces/King';

class GameLogic implements Logic {
    private gameData: GameData;
    private chessboard: Board;
    private specialMoves: SpecialMoveHandler;
    private player!: Player;
    private verifyingKingCheckState: boolean;
    private verifyingNewMoveState: boolean;
    private verifyingBoardState: boolean;
    private verifyingOpponentState: boolean;
    private moveContainsCheck: boolean;

    constructor(gameData: GameData, chessboard: Board) {
        this.gameData = gameData;
        this.chessboard = chessboard;
        this.specialMoves = new SpecialMoveHandler(this.gameData, this.chessboard);
        this.verifyingKingCheckState = false;
        this.verifyingNewMoveState = false;
        this.verifyingBoardState = false;
        this.moveContainsCheck = false;
        this.verifyingOpponentState = false;
    }

    checkRequestedMove(attackedSquare: Square) {
        const attackedSquares = this.gameData.getAttackedSquares();

        for (let i = 0; i < attackedSquares.length; i++) {
            if (attackedSquares[i].getPosition() === attackedSquare.getPosition()) {
                return true;
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
        const player = this.getPlayerForMoveValidation();
        const activePiece = activeSquare.getPiece();

        switch(true) {
            case this.isPawn(activePiece):
                this.specialMoves.enPassantOpeningDeterminant(attackedSquare);
                break;
            case this.isRook(activePiece):
                this.specialMoves.rookCanCastleDeterminant(player);
                break;
            case this.isKing(activePiece):
                this.specialMoves.kingCanCastleDeterminant(player);
                break;
        }
    }

    squareContainsAttack(piece: IPiece) {
        if (this.isVerifyingNewBoardState()) {
            this.determineMoveCase(piece);
            return;
        }
        
        this.determineMoveCase(piece);
        
        if (this.isKing(piece)) {
            this.playerCanCastleDeterminant(piece);
        }
        else if (this.isPawn(piece)) {
            this.specialMoves.enPassantCaptureDeteriminant(piece);
        }
    }

    determineMoveCase(piece: IPiece) {
        const pieceMoveDirections = piece.getMoveDirections();

        if (this.isKnight(piece)) {
            this.determineKnightSpecialCases(piece, pieceMoveDirections);
            return;
        }
        
        this.determineGeneralMoveCases(piece, pieceMoveDirections);
    }

    determineGeneralMoveCases(piece: IPiece, pieceMoveDirections: Map<string, number>) {
        const files = this.chessboard.getFiles();
        
        const piecePos = piece.getPosition();
        const pieceFile = files.indexOf(piecePos[0]);
        const pieceRank = Number(piecePos[1]);

        const moveDirections: any = {
            "N": () => (this.checkAttackableSquares(pieceFile, pieceRank + currentMove, piece)),
            'S': () => (this.checkAttackableSquares(pieceFile, pieceRank - currentMove, piece)),
            'E': () => (this.checkAttackableSquares(pieceFile + currentMove, pieceRank, piece)),
            'W': () => (this.checkAttackableSquares(pieceFile - currentMove, pieceRank, piece)),
            'NE': () => (this.checkAttackableSquares(pieceFile + currentMove, pieceRank + currentMove, piece)),
            'SE': () => (this.checkAttackableSquares(pieceFile + currentMove, pieceRank - currentMove, piece)),
            'NW': () => (this.checkAttackableSquares(pieceFile - currentMove, pieceRank + currentMove, piece)),
            'SW': () => (this.checkAttackableSquares(pieceFile - currentMove, pieceRank - currentMove, piece))
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

    determineKnightSpecialCases(piece: IPiece, pieceMoveDirections: Map<string, number>) {
        const files = this.chessboard.getFiles();

        const piecePos = piece.getPosition();
        const pieceFile = files.indexOf(piecePos[0]);
        const pieceRank = Number(piecePos[1]);

        const moveDirections: any = {
            'NNE': () => (this.checkAttackableSquares(pieceFile + 1, pieceRank + 2, piece)),
            'ENE': () => (this.checkAttackableSquares(pieceFile + 2, pieceRank + 1, piece)),
            'ESE': () => (this.checkAttackableSquares(pieceFile + 2, pieceRank - 1, piece)),
            'SSE': () => (this.checkAttackableSquares(pieceFile + 1, pieceRank - 2, piece)),
            'SSW': () => (this.checkAttackableSquares(pieceFile - 1, pieceRank - 2, piece)),
            'WSW': () => (this.checkAttackableSquares(pieceFile - 2, pieceRank - 1, piece)),
            'WNW': () => (this.checkAttackableSquares(pieceFile - 2, pieceRank + 1, piece)),
            'NWN': () => (this.checkAttackableSquares(pieceFile - 1, pieceRank + 2, piece))
        }

        pieceMoveDirections.forEach( (totalMoveCount: number, cardinalDirection: string) => {
            if (!moveDirections[cardinalDirection]()) { return; }
        })
    }
    
    checkAttackableSquares(file: number, rank: number, piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();
        const files = this.chessboard.getFiles();
        const attackedSquareIndex = this.calculateArrayIndex(file, rank);
        const attackedSquare = squaresArray[attackedSquareIndex];
        
        if (attackedSquareIndex < 0 || attackedSquareIndex > squaresArray.length - 1) { return; }
        
        if (attackedSquare.getPosition() === (files[file] + rank)) {
            if (this.isVerifyingKingCheckState()) {
                return !this.bKingCanEscapeCheck(piece, attackedSquare);
            }
            if (this.isVerifyingNewMoveState()) {
                return !this.kingBeingOpenedForAttack(piece, attackedSquare);
            }

            return this.bSquareContainsPiece(piece, attackedSquare);
        }
    }

    bSquareContainsPiece(piece: IPiece, attackedSquare: Square) {
        if (!attackedSquare.bSquareContainsPiece()) {
            return this.bAttackUnoccupiedSquares(piece, attackedSquare);
        }
        else { this.determinePlayerInCheck(piece, attackedSquare); }
        
        return this.bAttackOccupiedSquares(piece, attackedSquare);
    }

    determinePlayerInCheck(piece: IPiece, attackedSquare: Square) {
        const attackedPiece = attackedSquare.getPiece();
        
        if (this.isKing(attackedPiece) && this.bKingInCheck(piece, attackedPiece)) {
            this.player.setCheckStatus(true);
        }
    }

    bAttackUnoccupiedSquares(piece: IPiece, attackedSquare: Square) {
        if (this.isPawn(piece) && !this.pawnCanAttack(attackedSquare, piece)) {
            this.setSquareAttack(attackedSquare, piece);
            return false;
        }
        else {
            if (!this.isPawn(piece)) { this.setSquareAttack(attackedSquare, piece); }
        }
        if (this.isKing(piece)) {
            const attackingPieces = attackedSquare.getAttackingPiece();
            for (let i = 0; i < attackingPieces.length; i++) {
                if (attackingPieces[i].getColour() !== piece.getColour()) { return; }
            }
        }

        if (!this.isVerifyingNewBoardState()) {
            this.checkKingDefences(attackedSquare);
            
            if (!this.newMoveContainsCheck()) {
                this.gameData.setAttackedSquare(attackedSquare);
                return true;
            }
        }
        else {
            if (!this.isVerifyingOpponentState() && piece.getColour() === this.player.getColour()) {
                this.checkKingDefences(attackedSquare);

                if (!this.newMoveContainsCheck()) {
                    this.gameData.incrementValidMoveCount();
                }
            }
        }

        return true;
    }

    bAttackOccupiedSquares(piece: IPiece, attackedSquare: Square) {
        if (piece.getColour() === attackedSquare.getPiece().getColour()) {
            this.setSquareAttack(attackedSquare, piece);
            return false;
        }
        if (this.isPawn(piece)) {
            if (this.pawnCanAttack(attackedSquare, piece)) {
                return false;
            }
            else { this.setSquareAttack(attackedSquare, piece); }
        }
        else { this.setSquareAttack(attackedSquare, piece); }

        if (this.isKing(attackedSquare.getPiece())) {
            return false;
        }
        
        if (this.isKing(piece)) {
            const attackingPieces = attackedSquare.getAttackingPiece();
            for (let i = 0; i < attackingPieces.length; i++) {
                if (attackingPieces[i].getColour() !== piece.getColour()) { return; }
            }
        }

        if (!this.isVerifyingNewBoardState()) {
            this.checkKingDefences(attackedSquare);

            if (!this.newMoveContainsCheck()) {
                this.gameData.setAttackedSquare(attackedSquare);
                return false;
            }
        }
        else {
            if (!this.isVerifyingOpponentState() && piece.getColour() === this.player.getColour()) {
                this.checkKingDefences(attackedSquare);

                if (!this.newMoveContainsCheck()) {
                    this.gameData.incrementValidMoveCount();
                }
            }
        }

        return false;
    }

    setSquareAttack(attackedSquare: Square, piece: IPiece) {
        attackedSquare.setSquareAttacked(true);
        attackedSquare.setAttackingPiece(piece);
    }

    checkKingDefences(attackedSquare: Square) {
        this.setVerifyingNewMoveState(true);
        this.setNewMoveContainsCheck(false);
        
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();
        const defendingPiece = attackedSquare.getPiece();
        const kingPiece = this.player.getKing();

        activeSquare.removePiece();
        this.chessboard.setActiveSquare(attackedSquare);
        attackedSquare.setPiece(activePiece);

        this.moveContainsCheckDeterminant(kingPiece);
        
        attackedSquare.removePiece();
        activeSquare.setPiece(activePiece);

        if (defendingPiece) { 
            attackedSquare.setPiece(defendingPiece);
        }

        this.chessboard.setActiveSquare(activeSquare);
        this.setVerifyingNewMoveState(false);
    }

    moveContainsCheckDeterminant(piece: IPiece) {
        const king = piece as King;
        const generalDefence = king.getGeneralDefenceDirections();
        const knightDefence = king.getKnightDefenceDirections();

        this.setVerifyingKingCheckState(true);
        this.determineGeneralMoveCases(king, generalDefence);
        this.determineKnightSpecialCases(king, knightDefence);
        this.setVerifyingKingCheckState(false);
    }

    kingBeingOpenedForAttack(kingPiece: IPiece, attackedSquare: Square) {
        const files = this.chessboard.getFiles();
        const attackingPiece = attackedSquare.getPiece();
        const kingFile = kingPiece.getPosition()[0];
        const kingRank = kingPiece.getPosition()[1];
        const moveFile = attackedSquare.getPosition()[0];
        const moveRank = attackedSquare.getPosition()[1];
        
        if (attackingPiece) {
            const attackingPieceFile = attackingPiece.getPosition()[0];
            const attackingPieceRank = attackingPiece.getPosition()[1];
            
            if (attackingPiece.getColour() === this.player.getColour()) { return; }
            
            if (this.isRook(attackingPiece)) {
                if ((kingFile === attackingPieceFile) && (moveFile === kingFile)) {
                    this.setNewMoveContainsCheck(true);
                    return true;
                }
                else if (kingRank === attackingPieceRank && moveRank === kingRank) {
                    this.setNewMoveContainsCheck(true);
                    return true;
                }
            }
            else if (this.isQueen(attackingPiece)) {
                if (this.bSquaresLineUp(files.indexOf(kingFile), Number(kingRank), files.indexOf(attackingPieceFile), Number(attackingPieceRank))) {
                    this.setNewMoveContainsCheck(true);
                    return true;
                }
            }
            else if (kingFile !== attackingPieceFile && kingRank !== attackingPieceRank) {
                if (this.isPawn(attackingPiece)) {
                    this.pawnIsAttackingKing(kingPiece, attackedSquare);
                    return;
                }
                else if ((this.isBishop(attackingPiece)) && 
                    this.bSquaresLineUp(files.indexOf(kingFile), Number(kingRank), files.indexOf(attackingPieceFile), Number(attackingPieceRank))) {
                    this.setNewMoveContainsCheck(true);
                    return true;
                }
                else if (this.isKnight(attackingPiece)) {
                    if (!this.bSquaresLineUp(files.indexOf(kingFile), Number(kingRank), files.indexOf(attackingPieceFile), Number(attackingPieceRank))) {
                        this.setNewMoveContainsCheck(true);
                        return true;
                    }
                }
            }
        }
    }

    pawnIsAttackingKing(kingPiece: IPiece, attackedSquare: Square) {
        const files = this.chessboard.getFiles();
        const attackingPiece = attackedSquare.getPiece();

        const kingFile = kingPiece.getPosition()[0];
        const kingRank = kingPiece.getPosition()[1];
        const attackingPieceFile = attackingPiece.getPosition()[0];
        const attackingPieceRank = attackingPiece.getPosition()[1];
        
        if (this.player.getColour() === "White") {
            if (files.indexOf(attackingPieceFile) - 1 === files.indexOf(kingFile) && Number(attackingPieceRank) - 1 === Number(kingRank)) {
            this.setNewMoveContainsCheck(true);
            }
            else if (files.indexOf(attackingPieceFile) + 1 === files.indexOf(kingFile) && Number(attackingPieceRank) - 1 === Number(kingRank)) {
                this.setNewMoveContainsCheck(true);
            }
        }
        else if (this.player.getColour() === "Black") {
            if (files.indexOf(attackingPieceFile) - 1 === files.indexOf(kingFile) && Number(attackingPieceRank) + 1 === Number(kingRank)) {
                this.setNewMoveContainsCheck(true);
            }
            else if (files.indexOf(attackingPieceFile) + 1 === files.indexOf(kingFile) && Number(attackingPieceRank) + 1 === Number(kingRank)) {
                this.setNewMoveContainsCheck(true);
            }
        }
    }

    bKingCanEscapeCheck(kingPiece: IPiece, attackedSquare: Square) {
        const attackingPiece = attackedSquare.getPiece();

        if (attackingPiece) {
            return !this.kingBeingOpenedForAttack(kingPiece, attackedSquare)
        }
        
        return false;
    }

    bKingInCheck(piece: IPiece, attackedPiece: IPiece) {
        if (this.isPawn(piece) && piece.getPosition()[0] === attackedPiece.getPosition()[0]) {
            return;
        }

        return (piece.getColour() !== attackedPiece.getColour() && this.player.getColour() === attackedPiece.getColour());
    }

    determineAttackedSquares() {
        const squaresArray = this.chessboard.getSquaresArray();
        
        this.gameData.resetValidMoveCount();
        this.setVerifyingNewBoardState(true);

        for (let i = 0; i < squaresArray.length; i++) {
            squaresArray[i].setSquareAttacked(false);
            squaresArray[i].clearAttackingPieces();
        }

        this.setVerifyingOpponentState(true);

        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].bSquareContainsPiece() && squaresArray[i].getPiece().getColour() !== this.player.getColour()) {
                this.chessboard.setActiveSquare(squaresArray[i])
                this.squareContainsAttack(squaresArray[i].getPiece());
            }
        }

        this.setVerifyingOpponentState(false);

        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].bSquareContainsPiece() && squaresArray[i].getPiece().getColour() === this.player.getColour()) {
                this.chessboard.setActiveSquare(squaresArray[i])
                this.squareContainsAttack(squaresArray[i].getPiece());
            }
        }
        
        this.setVerifyingNewBoardState(false);
    }

    playerCanCastleDeterminant(piece: IPiece) {
        if (piece instanceof King) {
            
            if (!this.player.bCanCastleKingSide() && !this.player.bCanCastleQueenSide()) { return; }
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

    bSquaresLineUp(firstSquareFile: number, firstSquareRank: number, secondSquareFile: number, secondSquareRank: number) {
        const squaresLineUp =  Math.abs((firstSquareFile - secondSquareFile) & (firstSquareRank - secondSquareRank)) === 
            Math.abs((secondSquareFile - firstSquareFile) & (secondSquareRank - firstSquareRank));

        return squaresLineUp;
    }

    isPawn(piece: IPiece) { return piece.getType() === 'P' || piece.getType() === 'p'; }

    isBishop(piece: IPiece) { return piece.getType() === 'B' || piece.getType() === 'b'; }

    isKnight(piece: IPiece) { return piece.getType() === 'N' || piece.getType() === 'n'; }

    isRook(piece: IPiece) { return piece.getType() === 'R' || piece.getType() === 'r'; }

    isQueen(piece: IPiece) { return piece.getType() === 'Q' || piece.getType() === 'q'; }
    
    isKing(piece: IPiece) { return piece.getType() === 'K' || piece.getType() === 'k'; }

    isVerifyingKingCheckState() { return this.verifyingKingCheckState; }

    isVerifyingNewMoveState() { return this.verifyingNewMoveState; }
    
    isVerifyingNewBoardState() { return this.verifyingBoardState; }

    isVerifyingOpponentState() { return this.verifyingOpponentState; }

    newMoveContainsCheck() { return this.moveContainsCheck; }

    pawnCanAttack(square: Square, piece: IPiece) { return square.getPosition()[0] === piece.getPosition()[0]; }
    
    getPlayerForMoveValidation() { return this.player; }

    setPlayerForMoveValidation(player: Player) { this.player = player; }

    setVerifyingKingCheckState(verifying: boolean) { this.verifyingKingCheckState = verifying; }

    setVerifyingNewMoveState(verifying: boolean) { this.verifyingNewMoveState = verifying; }

    setVerifyingNewBoardState(verifying: boolean) { this.verifyingBoardState = verifying; }

    setVerifyingOpponentState(verifying: boolean) { this.verifyingOpponentState = verifying; }

    setNewMoveContainsCheck(check: boolean) { this.moveContainsCheck = check; }
    
}

export default GameLogic;
