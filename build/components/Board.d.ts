import Square from './Square';
import { IPiece } from './pieces/types';
declare class Board {
    private squares;
    private piecePositionsArray;
    private piecesArray;
    private activeSquare;
    private activePiece;
    constructor();
    initialise(): void;
    getFiles(): string[];
    getRanks(): number[];
    getStartingPieces(): string;
    getSquaresArray(): Square[];
    getPiecePositionsArray(): string[];
    getPieceObjectArray(): IPiece[];
    getActiveSquare(): Square;
    getActivePiece(): IPiece;
    setSquaresArray(squares: Array<Square>): void;
    setPiecePositionsArray(pieces: Array<string>): void;
    setPieceObjectArray(piece: IPiece): void;
    setActiveSquare(squarePos: Square): void;
    setActivePiece(piece: IPiece): void;
}
export default Board;
