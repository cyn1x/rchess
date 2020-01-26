import { IPiece, IPawn } from './types';
import Pieces from './Pieces';
import Square from '../Square';

class Pawn implements IPiece, IPawn {
    type: string;
    colour: string;
    image: string;
    position!: string;
    moves!: number;
    moveDirections!: Map<string, number>;
    startingSquare!: Square;
    firstMove!: boolean;
    upgraded!: boolean;

    constructor(type: string, colour: string, image: string) {
        this.type = type;
        this.colour = colour;
        this.image = image;

        this.initialise();
    }
    
    initialise() {
        this.upgraded = false;
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

    incrementMoveCount() {
        this.moves += 1;
        this.update();
    }

    hasUpgraded() { return this.upgraded; }

    getType() { return this.type; }

    getColour() { return this.colour; }

    getImage() { return this.image; }

    getMoveDirections() { return this.moveDirections; }

    getPosition() { return this.position; }

    getMoveCount() { return this.moves; }

    getStartingSquare() { return this.startingSquare; }

    setImage(image: string) { this.image = image; }

    setMoveDirections(directions: Map<string, number>) { this.moveDirections = directions; }

    setPosition(pos: string) { this.position = pos; }

    setStartingSquare(square: Square) { this.startingSquare = square; }

    setHasUpgraded(upgraded: boolean) { this.upgraded = upgraded; }

}

export default Pawn;
