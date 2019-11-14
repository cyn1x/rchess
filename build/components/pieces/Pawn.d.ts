import { IPiece } from './types';
declare class Pawn implements IPiece {
    type: string;
    colour: string;
    image: string;
    position: string;
    moves: number;
    moveDirections: Map<string, number>;
    private firstMove;
    private hasUpgraded;
    constructor(type: string, colour: string, image: string);
    initialise(): void;
    update(): void;
    incrementMoveNumber(move: number): void;
    getType(): string;
    getColour(): string;
    getImage(): string;
    getMoveDirections(): Map<string, number>;
    getPosition(): string;
    getMoveNumber(): number;
    getHasUpgraded(): boolean;
    setImage(image: string): void;
    setMoveDirections(directions: Map<string, number>): void;
    setPosition(pos: string): void;
    setHasUpgraded(upgraded: boolean): void;
}
export default Pawn;
