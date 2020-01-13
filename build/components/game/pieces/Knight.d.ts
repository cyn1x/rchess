import { IPiece } from './types';
import Square from '../Square';
declare class Knight implements IPiece {
    type: string;
    colour: string;
    image: string;
    position: string;
    moves: number;
    moveDirections: Map<string, number>;
    startingSquare: Square;
    constructor(type: string, colour: string, image: string);
    initialise(): void;
    incrementMoveCount(): void;
    getType(): string;
    getColour(): string;
    getImage(): string;
    getMoveDirections(): Map<string, number>;
    getPosition(): string;
    getMoveCount(): number;
    getStartingSquare(): Square;
    setImage(image: string): void;
    setMoveDirections(directions: Map<string, number>): void;
    setPosition(pos: string): void;
    setStartingSquare(square: Square): void;
}
export default Knight;
