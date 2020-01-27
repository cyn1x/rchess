import Square from '../Square';
export interface IPiece {
    getType(): string;
    getColour(): string;
    getImage(): string;
    getMoveDirections(): Map<string, number>;
    getPosition(): string;
    getMoveCount(): number;
    getStartingSquare(): Square;
    setImage(arg0: string): void;
    setMoveDirections(arg0: Map<string, number>): void;
    setPosition(arg0: string): void;
    setStartingSquare(arg0: Square): void;
    incrementMoveCount(): void;
    type: string;
    colour: string;
    image: string;
    position: string;
    moves: number;
    moveDirections: Map<string, number>;
    startingSquare: Square;
}
export interface IKing {
    inCheck: boolean;
    castled: boolean;
    isInCheck(): boolean;
    canCastle(): boolean;
    setCheckStatus(arg0: boolean): void;
    setCastledStatus(arg0: boolean): void;
}
export interface IRook {
    castled: boolean;
    canCastle(): boolean;
    setCastledStatus(arg0: boolean): void;
}
export interface IPawn {
    firstMove: boolean;
    upgraded: boolean;
    hasUpgraded(): boolean;
    setHasUpgraded(upgraded: boolean): void;
}
