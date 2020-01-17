import { IPiece } from './pieces/types';
import Square from './Square';

class GameData {
    private attackedSquares: Array<Square>;
    private capturedPieces: Array<IPiece>;

    constructor() {
        this.attackedSquares = [];
        this.capturedPieces = [];
    }

    clearAttackedSquares() { this.attackedSquares = []; }

    getAttackedSquares() { return this.attackedSquares; }

    getCapturedPieces() { return this.capturedPieces; }

    setAttackedSquares(attacked: Array<Square>) { this.attackedSquares = attacked; }

    setCapturedPiece(piece: IPiece) { this.capturedPieces.push(piece); }

}

export default GameData;
