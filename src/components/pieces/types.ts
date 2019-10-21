export interface IPiece {
    getType(): string;
    getColour(): string;
    getImage(): string;
    getMoveDirections(): Map<string, number>;
    getPosition(): string;
    getMoveNumber(): number;
    setImage(arg0: string): void;
    setMoveDirections(arg0: Map<string, number>): void;
    setPosition(arg0: string): void;
    incrementMoveNumber(arg0: number): void;

    type: string;
    colour: string;
    image: string;
    position: string;
    moves: number;
    moveDirections: Map<string, number>;
}
