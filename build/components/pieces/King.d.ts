import { IPiece } from './types';
declare class King implements IPiece {
    type: string;
    colour: string;
    image: string;
    position: string;
    moves: number;
    moveDirections: Map<string, number>;
    private inCheck;
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
    setCheck(check: boolean): void;
}
export default King;
