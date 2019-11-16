import { IPiece } from './pieces/types';

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
        const isKnight = (piece.getType() === 'N' || piece.getType() === 'n');

        if (isKnight) {
            this.knightSpecialCases(pos, piece);
            return;
        }

        this.generalMoveCases(pos, piece);
    }

    knightSpecialCases(pos: string, piece: IPiece) {
        const files = this.chessboard.getFiles();
        const pieceMoves = piece.getMoveDirections();

        const file = files.indexOf(pos[0])
        const rank = Number(pos[1])

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

        pieceMoves.forEach( (step: number, cardinal: string) => {
            if (knightMoveDirections[cardinal]()) {
                return;
            }
        })
    }

    generalMoveCases(pos: string, piece: IPiece) {
        const files = this.chessboard.getFiles();
        const pieceMoves = piece.getMoveDirections();

        const file = files.indexOf(pos[0])
        const rank = Number(pos[1])

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

        let currentMove = 0;
        if (pieceMoves) {
            pieceMoves.forEach( (step: number, cardinal: string) => {

                currentMove = 1;
                while (currentMove <= step) {
                    if (generalMoveDirections[cardinal]()) { return; }
                    currentMove++;
                }
            })
        }
    }

    checkBounds(file: number, rank: number, piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();
        const files = this.chessboard.getFiles();
        
        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].getPosition() === (files[file] + rank)) {
                if (!squaresArray[i].squareContainsPiece()) {
                    if (piece.getType() === 'P' || piece.getType() === 'p') {
                        if (squaresArray[i].getPosition()[0] === piece.getPosition()[0]) {
                            this.attackedSquares.push(squaresArray[i]);
                        }
                        return;
                    }
                    this.attackedSquares.push(squaresArray[i])
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
                this.attackedSquares.push(squaresArray[i])
                return true
            }
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

    determineCastling(pos: string, piece: IPiece) {
        
    }

    postMoveCalculations() {
        const chessboard = this.chessboard.getSquaresArray();
        for (let i = 0; i < chessboard.length; i++) {
            if (chessboard[i].getPiece()) {
                this.squareContainsAttack(chessboard[i].getPosition(), chessboard[i].getPiece());
            }
        }
    }
 
    getAttackedSquares() { return this.attackedSquares; }

    getOpponentAttackedSquares() { return this.opponentAttackedSquares; }

    setAttackedSquares(attacked: Array<Square>) { this.attackedSquares = attacked; }

    setOpponentAttackedSquares(attacked: Array<Square>) { this.opponentAttackedSquares = attacked; }
    
}

export default GameLogic;
