import { IPiece, IRook } from './types';
import Square from '../Square';
declare class Rook implements IPiece, IRook {
    type: string;
    colour: string;
    image: string;
    position: string;
    moves: number;
    moveDirections: Map<string, number>;
    startingSquare: Square;
    castled: boolean;
    constructor(type: string, colour: string, image: string);
    initialise(): void;
    incrementMoveCount(): void;
    canCastle(): boolean;
    getType(): string;
    getColour(): string;
    getImage(): string;
    getMoveDirections(): Map<string, number>;
    getMoveCount(): number;
    getPosition(): string;
    getStartingSquare(): Square;
    setImage(image: string): void;
    setMoveDirections(directions: Map<string, number>): void;
    setPosition(pos: string): void;
    setStartingSquare(square: Square): void;
    setCastledStatus(castled: boolean): void;
}
export default Rook;
