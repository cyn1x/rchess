import { IPiece } from './pieces/types';

class Square {
    private pos: string;
    private x: number;
    private y: number
    private w: number;
    private h: number;
    private piece!: IPiece;
    private hasPiece!: boolean;
    private colour!: string;
    private enPassant!: string;

    constructor(pos: string, x: number, y: number, w: number, h: number) {
        this.pos = pos;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    removePiece() { 
        delete this.piece;
        this.hasPiece = false;
    }

    squareContainsPiece() { return this.hasPiece; }

    getPiece() { return this.piece; }

    getPosition() { return this.pos; }

    getX() { return this.x; }

    getY() { return this.y; }

    getWidth() { return this.w; }
    
    getHeight() { return this.h }

    getColour() { return this.colour; }

    getEnPassant() { return this.enPassant; }

    setX(x: number) { this.x = x; }

    setY(y: number) { this.y = y; }

    setWidth(width: number) { this.w = width; }

    setHeight(height: number) { this.h = height; }

    setPiece(piece: IPiece) { 
        this.piece = piece;
        this.hasPiece = true;
        piece.setPosition(this.pos);
    }

    setColour(colour: string) { this.colour = colour; }

    setEnPassant(enPassant: string) { this.enPassant = enPassant }

}

export default Square;
