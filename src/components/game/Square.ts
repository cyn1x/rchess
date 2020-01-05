import { IPiece } from './pieces/types';

class Square {
    private pos: string;
    private x: number;
    private y: number
    private w: number;
    private h: number;
    private piece!: IPiece;
    private hasPiece!: boolean;
    private isAttacked!: boolean;
    private colour!: string;
    private enPassant!: string;
    private attackingPieces!: IPiece[];

    constructor(pos: string, x: number, y: number, w: number, h: number) {
        this.pos = pos;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.attackingPieces = [];
    }

    removePiece() { 
        delete this.piece;
        this.hasPiece = false;
        this.isAttacked = false;
    }

    bSquareContainsPiece() { return this.hasPiece; }

    bSquareIsAttacked() { return this.isAttacked; }

    clearAttackingPieces() { this.attackingPieces = []; }

    getAttackingPiece() { return this.attackingPieces; }

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

    setSquareAttacked(attacked: boolean) { this.isAttacked = attacked; }

    setAttackingPiece(piece: IPiece) { this.attackingPieces.push(piece); }

    setColour(colour: string) { this.colour = colour; }

    setEnPassant(enPassant: string) { this.enPassant = enPassant; }

}

export default Square;
