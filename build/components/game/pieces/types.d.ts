import Square from "../Square";
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
    canCastle: boolean;
    bIsInCheck(): boolean;
    bCanCastle(): boolean;
    setCheckStatus(arg0: boolean): void;
    setCastledStatus(arg0: boolean): void;
}
export interface IRook {
    canCastle: boolean;
    bCanCastle(): boolean;
    setCastledStatus(arg0: boolean): void;
}
export interface IPawn {
    firstMove: boolean;
    hasUpgraded: boolean;
    bHasUpgraded(): boolean;
    setHasUpgraded(upgraded: boolean): void;
}
