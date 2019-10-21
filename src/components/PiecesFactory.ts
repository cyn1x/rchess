import { IPiece } from './pieces/types';
import Pieces from './Pieces';
import Pawn from './pieces/Pawn';
import Knight from './pieces/Knight';
import Bishop from './pieces/Bishop';
import Rook from './pieces/Rook';
import Queen from './pieces/Queen';
import King from './pieces/King';

class PiecesFactory extends Pieces { 

    typeOfPiece(piece: string): IPiece {
        const white = "White";
        const black = "Black";
        switch(piece) {
            case 'P':
                const whitePawn = this.getChessPieceImgs().get(piece)
                if (whitePawn) { return new Pawn(piece, white, whitePawn) }
                else { throw new Error ("Image not defined"); }
            case 'N':
                const whiteKnight = this.getChessPieceImgs().get(piece)
                if (whiteKnight) { return new Knight(piece, white, whiteKnight) }
                else { throw new Error ("Image not defined"); }
            case 'B':
                const whiteBishop = this.getChessPieceImgs().get(piece)
                if (whiteBishop) { return new Bishop(piece, white, whiteBishop) }
                else { throw new Error ("Image not defined"); }
            case 'R':
                const whiteRook = this.getChessPieceImgs().get(piece)
                if (whiteRook) { return new Rook(piece, white, whiteRook) }
                else { throw new Error ("Image not defined"); }
            case 'Q':
                const whiteQueen = this.getChessPieceImgs().get(piece)
                if (whiteQueen) { return new Queen(piece, white, whiteQueen) }
                else { throw new Error ("Image not defined"); }
            case 'K':
                const whiteKing = this.getChessPieceImgs().get(piece)
                if (whiteKing) { return new King(piece, white, whiteKing) }
                else { throw new Error ("Image not defined"); }
            case 'p':
                const blackPawn = this.getChessPieceImgs().get(piece)
                if (blackPawn) { return new Pawn(piece, black, blackPawn) }
                else { throw new Error ("Image not defined"); }
            case 'n':
                const blackKnight = this.getChessPieceImgs().get(piece)
                if (blackKnight) { return new Knight(piece, black, blackKnight) }
                else { throw new Error ("Image not defined"); }
            case 'b':
                const blackBishop = this.getChessPieceImgs().get(piece)
                if (blackBishop) { return new Bishop(piece, black, blackBishop) }
                else { throw new Error ("Image not defined"); }
            case 'r':
                const blackRook = this.getChessPieceImgs().get(piece)
                if (blackRook) { return new Rook(piece, black, blackRook) }
                else { throw new Error ("Image not defined"); }
            case 'q':
                const blackQueen = this.getChessPieceImgs().get(piece)
                if (blackQueen) { return new Queen(piece, black, blackQueen) }
                else { throw new Error ("Image not defined"); }
            case 'k':
                const blackKing = this.getChessPieceImgs().get(piece)
                if (blackKing) { return new King(piece, black, blackKing) }
                else { throw new Error ("Image not defined"); }
            default:
                throw new Error("Piece does not exist");
        }
    }
}

export default PiecesFactory;
