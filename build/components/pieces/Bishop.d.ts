import { IPiece } from './types';
declare class Bishop implements IPiece {
    type: string;
    colour: string;
    image: string;
    position: string;
    moves: number;
    moveDirections: Map<string, number>;
    constructor(type: string, colour: string, image: string);
    initialise(): void;
    incrementMoveNumber(move: number): void;
    getType(): string;
    getColour(): string;
    getImage(): string;
    getMoveDirections(): Map<string, number>;
    getPosition(): string;
    getMoveNumber(): number;
    setImage(image: string): void;
    setMoveDirections(directions: Map<string, number>): void;
    setPosition(pos: string): void;
}
export default Bishop;
