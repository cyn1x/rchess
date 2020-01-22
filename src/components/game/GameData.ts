import { IPiece } from './entities/pieces/types';

import Square from './entities/Square';

class GameData {
    private attackedSquaresArray: Array<Square>;
    private capturedPiecesArray: Array<IPiece>;
    private numberOfValidMoves: number;

    constructor() {
        this.attackedSquaresArray = [];
        this.capturedPiecesArray = [];
        this.numberOfValidMoves = 0;
    }

    incrementValidMoveCount() { this.numberOfValidMoves++; }

    clearAttackedSquares() { this.attackedSquaresArray = []; }

    resetValidMoveCount() { this.numberOfValidMoves = 0; }

    getAttackedSquares() { return this.attackedSquaresArray; }

    getCapturedPieces() { return this.capturedPiecesArray; }

    getNumberOfValidMoves() { return this.numberOfValidMoves; }

    setAttackedSquare(square: Square) { this.attackedSquaresArray.push(square); }

    setCapturedPiece(piece: IPiece) { this.capturedPiecesArray.push(piece); }

}

export default GameData;
