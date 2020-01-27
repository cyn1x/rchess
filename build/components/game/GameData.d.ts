import { IPiece } from './entities/pieces/types';
import Square from './entities/Square';
declare class GameData {
    private attackedSquaresArray;
    private capturedPiecesArray;
    private numberOfValidMoves;
    constructor();
    incrementValidMoveCount(): void;
    clearAttackedSquares(): void;
    resetValidMoveCount(): void;
    getAttackedSquares(): Square[];
    getCapturedPieces(): IPiece[];
    getNumberOfValidMoves(): number;
    setAttackedSquare(square: Square): void;
    setCapturedPiece(piece: IPiece): void;
}
export default GameData;
