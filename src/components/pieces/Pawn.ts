import { IPiece } from './types';
import Pieces from '../Pieces';

class Pawn implements IPiece {
    type: string;
    colour: string;
    image: string;
    position!: string;
    moves!: number;
    moveDirections!: Map<string, number>;
    private firstMove!: boolean;
    private hasUpgraded!: boolean;

    constructor(type: string, colour: string, image: string) {
        this.type = type;
        this.colour = colour;
        this.image = image;

        this.initialise();
    }
    
    initialise() {
        this.hasUpgraded = false;
        this.moves = 0;
        const pieces = new Pieces();

        this.setMoveDirections(pieces.pawnMoves(this.type));
    }

    update() {
        if (!this.firstMove) { 
            this.firstMove = true;
            if (this.type === 'P') {
                this.moveDirections.set('N', 1)
            }
            else {
                this.moveDirections.set('S', 1)
            }
        }
    }

    incrementMoveNumber(move: number) {
        this.moves += move;
        this.update();
    }

    getType() { return this.type; }

    getColour() { return this.colour; }

    getImage() { return this.image; }

    getMoveDirections() { return this.moveDirections; }

    getPosition() { return this.position; }

    getMoveNumber() { return this.moves; }

    getHasUpgraded() { return this.hasUpgraded; }

    setImage(image: string) { this.image = image; }

    setMoveDirections(directions: Map<string, number>) { this.moveDirections = directions; }

    setPosition(pos: string) { this.position = pos; }

    setHasUpgraded(upgraded: boolean) { this.hasUpgraded = upgraded; }

}

export default Pawn;
