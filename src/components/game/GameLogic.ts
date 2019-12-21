import { IPiece, IPieceKing } from './pieces/types';

import Board from './Board';
import Square from './Square';

class GameLogic {
    private chessboard: Board;
    private attackedSquares!: Array<Square>;
    private opponentAttackedSquares!: Array<Square>;

    constructor(chessboard: Board) {
        this.chessboard = chessboard;
        this.attackedSquares = [];
        this.opponentAttackedSquares = [];
    }

    squareContainsAttack(pos: string, piece: IPiece) {
        if (this.bIsKnight(piece)) {
            this.knightSpecialCases(pos, piece);
            return;
        }

        this.generalMoveCases(pos, piece);

        if (this.bIsKing(piece) || this.bIsRook(piece)) {
            this.castlingDeterminant(piece);
        }
        else if (this.bIsPawn(piece)) {
            this.enPassantDeterminant();
        }
    }

    specialMoveCases(pos: string, piece: IPiece) {
        
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
                if (moveDirections[cardinalDirection]()) { return; }
                currentMove++;
            }
        })
    }

    knightSpecialCases(pos: string, piece: IPiece) {
        const files = this.chessboard.getFiles();
        const pieceMoves = piece.getMoveDirections();

        const file = files.indexOf(pos[0])
        const rank = Number(pos[1])

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
            if (moveDirections[cardinalDirection]()) { return; }
        })
    }

    checkAttackableSquares(file: number, rank: number, piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();
        const files = this.chessboard.getFiles();
        const boardLength = this.chessboard.getSquaresArray().length / 8;
        const attackedSquare = (boardLength - rank) * boardLength + file;
        
        if (attackedSquare < 0 || attackedSquare > squaresArray.length - 1) { return; }
        
        if (squaresArray[attackedSquare].getPosition() === (files[file] + rank)) {

            if (!squaresArray[attackedSquare].bSquareContainsPiece()) {
                if (this.bIsPawn(piece)) {
                    if (this.bPawnCanAttack(squaresArray[attackedSquare], piece)) {
                        this.setSquareAttack(attackedSquare, piece);
                        return true;
                    }
                }
                else {
                    this.setSquareAttack(attackedSquare, piece);
                }
                this.attackedSquares.push(squaresArray[attackedSquare]);
                return false;
            }
            if (piece.getColour() === squaresArray[attackedSquare].getPiece().getColour()) {
                return true;
            }
            if (this.bIsPawn(piece)) {
                if (this.bPawnPathBlocked(squaresArray[attackedSquare], piece)) {
                    return true;
                }
            }
            else {
                this.setSquareAttack(attackedSquare, piece);
            }
            this.attackedSquares.push(squaresArray[attackedSquare]);
            return true;
        }
    }

    checkRequestedMove(squares: Square) {
        for (let i = 0; i < this.attackedSquares.length; i++) {
            if (this.attackedSquares[i].getPosition() === squares.getPosition()) {
                return true;
            }
        }
        return false;
    }

    castlingDeterminant(piece: IPiece) {
        
    }

    enPassantDeterminant() {

    }

    setSquareAttack(attackedSquare: number, piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();

        squaresArray[attackedSquare].setSquareAttacked(true);
        squaresArray[attackedSquare].setAttackingPiece(piece);
    }

    determineAttackedSquares() {
        const chessboard = this.chessboard.getSquaresArray();
        for (let i = 0; i < chessboard.length; i++) {
            chessboard[i].setSquareAttacked(false);
            chessboard[i].clearAttackingPieces();
        }
        for (let i = 0; i < chessboard.length; i++) {
            if (chessboard[i].getPiece()) {
                this.squareContainsAttack(chessboard[i].getPosition(), chessboard[i].getPiece());
            }
        }
    }

    bPawnCanAttack(square: Square, piece: IPiece) { return (square.getPosition()[0] !== piece.getPosition()[0]); }

    bPawnPathBlocked(square: Square, piece: IPiece) { return (piece.getPosition()[0] === square.getPosition()[0]); }

    bIsPawn(piece: IPiece) { return piece.getType() === 'P' || piece.getType() === 'p'; }

    bIsKnight(piece: IPiece) { return (piece.getType() === 'N' || piece.getType() === 'n'); }

    bIsRook(piece: IPiece) { return piece.getType() === 'R' || piece.getType() === 'r'; }

    bIsKing(piece: IPiece) { return piece.getType() === 'K' || piece.getType() === 'k'; }

    clearAttackedSquares() { this.attackedSquares = []; }
 
    getAttackedSquares() { return this.attackedSquares; }

    setAttackedSquares(attacked: Array<Square>) { this.attackedSquares = attacked; }
    
}

export default GameLogic;
