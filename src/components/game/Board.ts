import Square from './Square';
import { IPiece } from './pieces/types';

const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
const pieces = "PPPPPPppppppNNnnBBbbRRrrQqKk";

class Board {
    private squares!: Array<Square>
    private piecePositionsArray!: Array<string>
    private piecesArray!: Array<IPiece>;
    private activeSquare!: Square;
    private westCastlingSquare!: Square;
    private eastCastlingSquare!: Square;
    private enPassantSquare!: Square;

    constructor() {
        this.initialise();
    }

    initialise() {
        this.squares = [];
        this.piecePositionsArray = [];
        this.piecesArray = [];
    }

    getFiles() { return files; }

    getRanks() { return ranks; }

    getStartingPieces() { return pieces; }

    getSquaresArray() { return this.squares; }

    getPiecePositionsArray() { return this.piecePositionsArray; }

    getPieceObjectArray() { return this.piecesArray; }

    getActiveSquare() { return this.activeSquare; }

    getWestCastlingSquare() { return this.westCastlingSquare; }

    getEastCastlingSquare() { return this.eastCastlingSquare; }

    getEnPassantSquare() { return this.enPassantSquare; }

    setSquaresArray(squares: Array<Square>) { this.squares = squares }

    setPiecePositionsArray(pieces: Array<string>) { this.piecePositionsArray = pieces; }

    setPieceObjectArray(piece: IPiece) { this.piecesArray.push(piece); }

    setActiveSquare(square: Square) { this.activeSquare = square; }

    setWestCastlingSquare(square: Square) { this.westCastlingSquare = square; }

    setEastCastlingSquare(square: Square) { this.eastCastlingSquare = square; }

    setEnPassantSquare(square: Square) { this.enPassantSquare = square; }

}

export default Board;
