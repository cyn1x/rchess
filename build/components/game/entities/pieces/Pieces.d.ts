export declare const wP: any;
export declare const wN: any;
export declare const wB: any;
export declare const wR: any;
export declare const wQ: any;
export declare const wK: any;
export declare const bP: any;
export declare const bN: any;
export declare const bB: any;
export declare const bR: any;
export declare const bQ: any;
export declare const bK: any;
export declare class Pieces {
    private pieceImages;
    constructor();
    initialise(): void;
    setChessPieceImgs(): void;
    pawnMoves(colour: string): Map<any, any>;
    knightMoves(): Map<any, any>;
    bishopMoves(): Map<any, any>;
    rookMoves(): Map<any, any>;
    queenMoves(): Map<any, any>;
    kingMoves(): Map<any, any>;
    generalDefence(): Map<any, any>;
    knightDefence(): Map<any, any>;
    getChessPieceImgs(): Map<string, string>;
}
export default Pieces;
