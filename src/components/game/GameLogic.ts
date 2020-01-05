import { IPiece } from './pieces/types';

import Board from './Board';
import Square from './Square';
import Player from './Player';
import Game from './Game';

class GameLogic {
    private chessboard: Board;
    private player: Player;
    private attackedSquares!: Array<Square>;
    private game: Game;

    constructor(game: Game, chessboard: Board, player: Player) {
        this.game = game;
        this.chessboard = chessboard;
        this.player = player;
        this.attackedSquares = [];
    }

    checkRequestedMove(attackedSquare: Square) {
        for (let i = 0; i < this.attackedSquares.length; i++) {
            if (this.attackedSquares[i].getPosition() === attackedSquare.getPosition()) {
                this.verifyMoveState(attackedSquare);
                return !this.player.isInCheck();
            }
        }
    }

    squareContainsAttack(pos: string, piece: IPiece) {
        
        if (this.bIsKnight(piece)) {
            this.knightSpecialCases(pos, piece);
            return;
        }

        this.generalMoveCases(pos, piece);

        if (this.bIsKing(piece)) {
            this.castlingDeterminant(piece);
        }
        else if (this.bIsPawn(piece)) {
            this.enPassantDeterminant(piece);
        }
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
        else { this.checkDeterminant(piece, attackedSquareIndex); }
        
        return this.bAttackOccupiedSquares(piece, attackedSquareIndex);
    }

    bAttackUnoccupiedSquares(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();

        if (this.bIsPawn(piece) && !this.bPawnCanAttack(squaresArray[attackedSquareIndex], piece)) {
            this.setSquareAttack(attackedSquareIndex, piece);
            return false;
        }
        else { this.setSquareAttack(attackedSquareIndex, piece); }

        this.attackedSquares.push(squaresArray[attackedSquareIndex]);
        return true;
    }

    bAttackOccupiedSquares(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();

        if (piece.getColour() === squaresArray[attackedSquareIndex].getPiece().getColour()) {
            return false;
        }
        if (this.bIsPawn(piece)) {
            if (this.bPawnCanAttack(squaresArray[attackedSquareIndex], piece)) {
                return true;
            }
        }
        else { this.setSquareAttack(attackedSquareIndex, piece); }

        this.attackedSquares.push(squaresArray[attackedSquareIndex]);
        return false;
    }

    bKingInCheck(piece: IPiece, attackedPiece: IPiece) {
        return (piece.getColour() !== attackedPiece.getColour() && this.player.getColour() === attackedPiece.getColour());
    }

    setSquareAttack(attackedSquare: number, piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();

        squaresArray[attackedSquare].setSquareAttacked(true);
        squaresArray[attackedSquare].setAttackingPiece(piece);
    }

    determineAttackedSquares() {
        const squaresArray = this.chessboard.getSquaresArray();

        for (let i = 0; i < squaresArray.length; i++) {
            squaresArray[i].setSquareAttacked(false);
            squaresArray[i].clearAttackingPieces();
        }
        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].getPiece()) {
                this.squareContainsAttack(squaresArray[i].getPosition(), squaresArray[i].getPiece());
            }
        }
    }

    verifyMoveState(attackedSquare: Square) {
        
    }

    checkDeterminant(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const attackedPiece = squaresArray[attackedSquareIndex].getPiece();

        if (this.bIsKing(attackedPiece) && this.bKingInCheck(piece, attackedPiece)) {
            this.player.setCheckStatus(true);
        }
    }

    castlingDeterminant(piece: IPiece) {
        if (piece.getMoveCount() > 0) { return; }
        
    }

    enPassantDeterminant(piece: IPiece) {
        if (piece.getMoveCount() === 0) { return; }

    }

    bIsPawn(piece: IPiece) { return piece.getType() === 'P' || piece.getType() === 'p'; }

    bIsKnight(piece: IPiece) { return (piece.getType() === 'N' || piece.getType() === 'n'); }

    bIsRook(piece: IPiece) { return piece.getType() === 'R' || piece.getType() === 'r'; }

    bIsKing(piece: IPiece) { return piece.getType() === 'K' || piece.getType() === 'k'; }

    bPawnCanAttack(square: Square, piece: IPiece) { return (square.getPosition()[0] === piece.getPosition()[0]); }

    clearAttackedSquares() { this.attackedSquares = []; }
 
    getAttackedSquares() { return this.attackedSquares; }

    setAttackedSquares(attacked: Array<Square>) { this.attackedSquares = attacked; }
    
}

export default GameLogic;
