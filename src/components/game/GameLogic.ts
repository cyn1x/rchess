import { IPiece } from './pieces/types';

import Board from './Board';
import Square from './Square';
import Player from './Player';
import King from './pieces/King';
import Rook from './pieces/Rook';
import Pawn from './pieces/Pawn';

class GameLogic {
    private chessboard: Board;
    private player: Player;
    private attackedSquares!: Array<Square>;
    private bVerifyingRequestedMove: boolean;
    private bVerifyingBoardState: boolean;

    constructor(chessboard: Board, player: Player) {
        this.chessboard = chessboard;
        this.player = player;
        this.attackedSquares = [];
        this.bVerifyingRequestedMove = false;
        this.bVerifyingBoardState = false;
    }

    checkRequestedMove(attackedSquare: Square) {
        for (let i = 0; i < this.attackedSquares.length; i++) {
            if (this.attackedSquares[i].getPosition() === attackedSquare.getPosition()) {
                this.verifyRequestedMove(attackedSquare);

                return !this.player.bIsInCheck();
            }
        }
    }

    checkSpecialMove(square: Square) {
        if (square.bIsCastlingSquare()) {
            const westCastlingSquare = this.chessboard.getWestCastlingSquare();
            const eastCastlingSquare = this.chessboard.getEastCastlingSquare();

            switch(square) {
                case this.chessboard.getWestCastlingSquare():
                    return westCastlingSquare;
                case this.chessboard.getEastCastlingSquare():
                    return eastCastlingSquare;
            }
        }
        if (square.bIsEnPassantSquare()) {
            const enPassantSquare = this.chessboard.getEnPassantSquare();

            return enPassantSquare;
        }
    }

    checkMoveSideEffects(activeSquare: Square, attackedSquare: Square) {
        const activePiece = activeSquare.getPiece();

        switch(true) {
            case activePiece instanceof Pawn:
                this.enPassantOpeningDeterminant(attackedSquare);
                break;
            case activePiece instanceof Rook:
                this.rookCanCastleDeterminant();
                break;
            case activePiece instanceof King:
                this.kingCanCastleDeterminant();
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
            this.enPassantCaptureDeteriminant(piece);
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
        const boardLength = squaresArray.length / 8;
        const attackedSquareIndex = (boardLength - rank) * boardLength + file;
        
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
        
        if (!this.bIsVerifyingRequestedMove()) {
            return this.bAttackOccupiedSquares(piece, attackedSquareIndex);
        }
    }

    bAttackUnoccupiedSquares(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();

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
        this.attackedSquares.push(squaresArray[attackedSquareIndex]);
        return true;
    }

    bAttackOccupiedSquares(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();

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
        this.attackedSquares.push(squaresArray[attackedSquareIndex]);
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

        activeSquare.removePiece();
        this.chessboard.setActiveSquare(attackedSquare);
        attackedSquare.setPiece(activePiece);
        this.setVerifyingMove(true);
        this.clearAttackedSquares();

        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].bSquareContainsPiece()) {
                this.squareContainsAttack(squaresArray[i].getPosition(), squaresArray[i].getPiece());
            }
        }

        this.clearAttackedSquares();
        attackedSquare.removePiece();
        activeSquare.setPiece(activePiece);
        this.chessboard.setActiveSquare(activeSquare);
        this.setVerifyingMove(false);
        this.squareContainsAttack(activePiece.getPosition(), activePiece);
    }

    playerInCheckDeterminant(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const attackedPiece = squaresArray[attackedSquareIndex].getPiece();
        
        if (this.bIsKing(attackedPiece) && this.bKingInCheck(piece, attackedPiece)) {
            this.player.setCheckStatus(true);
        }
    }

    enPassantOpeningDeterminant(attackedSquare: Square) {
        const squaresArray = this.chessboard.getSquaresArray();
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();

        if (activePiece instanceof Pawn) {
            if (activePiece.getMoveCount() !== 0) { return; }

            const files = this.chessboard.getFiles();
            const boardLength = squaresArray.length / 8;
            
            const pos = attackedSquare.getPosition();
            const file = files.indexOf(pos[0]);
            const rank = (activePiece.getColour() === "White" ? Number(pos[1]) - 1 : Number(pos[1]) + 1) 
            const targetSquareIndex = (boardLength - rank) * boardLength + file;

            const oldPos = activeSquare.getPosition();
            const oldFile = files.indexOf(oldPos[0])
            const oldRank = (activePiece.getColour() === "White" ? Number(oldPos[1]) + 1 : Number(oldPos[1]) - 1) 
            const activeSquareIndex = (boardLength - oldRank) * boardLength + oldFile;

            if (squaresArray[targetSquareIndex] === squaresArray[activeSquareIndex]) {
                squaresArray[targetSquareIndex].setEnPassantSquare(true);
                this.chessboard.setEnPassantSquare(squaresArray[targetSquareIndex]);
            }
        }
    }

    enPassantCaptureDeteriminant(piece: IPiece) {
        
    }

    determineEnPassantSquare(enPassantSquare: string) {
        if (enPassantSquare !== "-") {
            const squaresArray = this.chessboard.getSquaresArray();
            const files = this.chessboard.getFiles();
            const boardLength = squaresArray.length / 8;
            
            const pos = enPassantSquare;
            let file = files.indexOf(pos[0]);
            const rank = Number(pos[1]);
            const targetSquareIndex = (boardLength - rank) * boardLength + file;

            squaresArray[targetSquareIndex].setEnPassantSquare(true);
            this.chessboard.setEnPassantSquare(squaresArray[targetSquareIndex]);
        }
    }

    kingCanCastleDeterminant() {
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();
        
        if (activePiece.getColour() === "White") {
            if (activeSquare.getPosition() === "E1") {
                this.player.setCanCastledKingSide(false);
                this.player.setCanCastledQueenSide(false);
            }
        }
        else if (activePiece.getColour() === "Black") {
            if (activePiece.getPosition() === "E8") {
                this.player.setCanCastledKingSide(false);
                this.player.setCanCastledQueenSide(false);
            }
        }
    }

    rookCanCastleDeterminant() {
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();

        if (activePiece.getColour() === "White") {
            if (activeSquare.getPosition() === "A1") {
                this.player.setCanCastledQueenSide(false);
            }
            else if (activeSquare.getPosition() === "H1") {
                this.player.setCanCastledKingSide(false);
            }
        }
        else if (activePiece.getColour() === "Black") {
            if (activeSquare.getPosition() === "A8") {
                this.player.setCanCastledQueenSide(false);
            }
            else if (activeSquare.getPosition() === "H8") {
                this.player.setCanCastledKingSide(false);
            }
        }
    }

    playerCanCastleDeterminant(piece: IPiece) {
        if (piece instanceof King) {

            if (!piece.bCanCastle() || piece.bIsInCheck()) { return; }
            if (piece.getStartingSquare().getPosition() !== piece.getPosition()) { return; }

            this.westCastlingDeterminant(piece.getPosition());
            this.eastCastlingDeterminant(piece.getPosition());
        }
    }

    westCastlingDeterminant(pos: string) {
        const squaresArray = this.chessboard.getSquaresArray();
        const files = this.chessboard.getFiles();
        const boardLength = squaresArray.length / 8;
        
        let file = files.indexOf(pos[0]);
        const rank = Number(pos[1]);
        const firstSquareInRow = 0;

        while (file != firstSquareInRow) {
            file = file - 1;
            const targetSquareIndex = (boardLength - rank) * boardLength + file;
            if (this.bKingPassesThroughAttackedSquare(targetSquareIndex, file)) { return false }
            if (!this.bKingCanCastle(targetSquareIndex, file)) { return false; }
        }
        
        file = files.indexOf(pos[0]) - 2;
        const targetSquareIndex = (boardLength - rank) * boardLength + file;
        squaresArray[targetSquareIndex].setCastlingSquare(true);
        this.chessboard.setWestCastlingSquare(squaresArray[targetSquareIndex]);
        this.attackedSquares.push(squaresArray[targetSquareIndex]);
    }

    eastCastlingDeterminant(pos: string) {
        const squaresArray = this.chessboard.getSquaresArray();
        const files = this.chessboard.getFiles();
        const boardLength = squaresArray.length / 8;
        
        let file = files.indexOf(pos[0]);
        const rank = Number(pos[1]);
        const lastSquareInRow = 7;

        while (file != lastSquareInRow) {
            file = file + 1;
            const targetSquareIndex = (boardLength - rank) * boardLength + file;
            if (this.bKingPassesThroughAttackedSquare(targetSquareIndex, file)) { return false }
            if (!this.bKingCanCastle(targetSquareIndex, file)) { return false; }
        }

        file = files.indexOf(pos[0]) + 2;
        const targetSquareIndex = (boardLength - rank) * boardLength + file;
        squaresArray[targetSquareIndex].setCastlingSquare(true);
        this.chessboard.setEastCastlingSquare(squaresArray[targetSquareIndex]);
        this.attackedSquares.push(squaresArray[targetSquareIndex]);
    }

    castleRookQueenSide(square: Square) {
        const squaresArray = this.chessboard.getSquaresArray();
        const boardLength = squaresArray.length / 8;
        const files = this.chessboard.getFiles();

        const pos = square.getPosition();
        const file = files.indexOf(pos[0]) - 2;
        const rank = Number(pos[1]);
        const queenSideRookSquareIndex = (boardLength - rank) * boardLength + file;

        const newPos = square.getPosition();
        const newFile = files.indexOf(newPos[0]) + 1;
        const newRank = Number(newPos[1]);
        const newRookPosSquareIndex = (boardLength - newRank) * boardLength + newFile;

        squaresArray[newRookPosSquareIndex].setPiece(squaresArray[queenSideRookSquareIndex].getPiece());
        squaresArray[queenSideRookSquareIndex].removePiece();

        return queenSideRookSquareIndex;
    }

    castleRookKingSide(square: Square) {
        const squaresArray = this.chessboard.getSquaresArray();
        const boardLength = squaresArray.length / 8;
        const files = this.chessboard.getFiles();

        const pos = square.getPosition();
        const file = files.indexOf(pos[0]) + 1;
        const rank = Number(pos[1]);
        const kingSideRookSquareIndex = (boardLength - rank) * boardLength + file;

        const newPos = square.getPosition();
        const newFile = files.indexOf(newPos[0]) - 1;
        const newRank = Number(newPos[1]);
        const newRookPosSquareIndex = (boardLength - newRank) * boardLength + newFile;

        squaresArray[newRookPosSquareIndex].setPiece(squaresArray[kingSideRookSquareIndex].getPiece());
        squaresArray[kingSideRookSquareIndex].removePiece();

        return kingSideRookSquareIndex;
    }

    bKingPassesThroughAttackedSquare(targetSquareIndex: number, file: number) {
        const squaresArray = this.chessboard.getSquaresArray();

        if (file === 3 || file === 2 || file === 5 || file === 6) {
            const attackingPieces = squaresArray[targetSquareIndex].getAttackingPiece();
            const activePiece = this.chessboard.getActiveSquare().getPiece();

            for (let i = 0; i < attackingPieces.length; i++) {
                if (attackingPieces[i].getColour() !== activePiece.getColour()) { return true; }
            }
        }
    }

    bKingCanCastle(targetSquareIndex: number, file: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const firstSquareInRow = 0;
        const lastSquareInRow = 7;

        if ((file === firstSquareInRow || file === lastSquareInRow)) {
            return (squaresArray[targetSquareIndex].bSquareContainsPiece() && this.bRookCanCastle(squaresArray, targetSquareIndex));
        }
        else {
            return (!this.bCastlingMoveIsObstructed(squaresArray, targetSquareIndex));
        }
    }

    bCastlingMoveIsObstructed(squaresArray: Array<Square>, targetSquareIndex: number) {
        return squaresArray[targetSquareIndex].bSquareContainsPiece();
    }

    bRookCanCastle(squaresArray: Array<Square>, targetSquareIndex: number) {
        const piece = squaresArray[targetSquareIndex].getPiece();
        if (piece instanceof Rook) {
            return (piece.bCanCastle());
        }
    }

    bKingInCheck(piece: IPiece, attackedPiece: IPiece) {
        if (this.bIsPawn(piece) && piece.getPosition()[0] === attackedPiece.getPosition()[0]) return;
        return (piece.getColour() !== attackedPiece.getColour() && this.player.getColour() === attackedPiece.getColour());
    }

    bIsVerifyingRequestedMove() { return this.bVerifyingRequestedMove; }

    bIsVerifyingNewBoardState() { return this.bVerifyingBoardState; }

    bIsPawn(piece: IPiece) { return piece.getType() === 'P' || piece.getType() === 'p'; }

    bIsKnight(piece: IPiece) { return piece.getType() === 'N' || piece.getType() === 'n'; }

    bIsBishop(piece: IPiece) { return piece.getType() === 'B' || piece.getType() === 'b'; }

    bIsRook(piece: IPiece) { return piece.getType() === 'R' || piece.getType() === 'r'; }

    bisQueen(piece: IPiece) { return piece.getType() === 'Q' || piece.getType() === 'q'; }

    bIsKing(piece: IPiece) { return piece.getType() === 'K' || piece.getType() === 'k'; }

    bPawnCanAttack(square: Square, piece: IPiece) { return square.getPosition()[0] === piece.getPosition()[0]; }

    clearAttackedSquares() { this.attackedSquares = []; }
 
    getAttackedSquares() { return this.attackedSquares; }

    setAttackedSquares(attacked: Array<Square>) { this.attackedSquares = attacked; }

    setVerifyingMove(verifying: boolean) { this.bVerifyingRequestedMove = verifying; }

    setVerifyingNewBoardState(verifying: boolean) { this.bVerifyingBoardState = verifying; }
    
}

export default GameLogic;
