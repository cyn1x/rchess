import { IPiece } from './types';
import Pieces from './Pieces';
import Square from '../Square';

class Queen implements IPiece {
    type: string;
    colour: string;
    image: string;
    position!: string;
    moves!: number;
    moveDirections!: Map<string, number>;
    startingSquare!: Square;

    constructor(type: string, colour: string, image: string) {
        this.type = type;
        this.colour = colour;
        this.image = image;

        this.initialise();
    }

    initialise() {
        this.moves = 0;
        const pieces = new Pieces();

        this.setMoveDirections(pieces.queenMoves());
    }

    incrementMoveCount() { this.moves += 1; }

    getType() { return this.type; }

    getColour() { return this.colour; }

    getImage() { return this.image; }

    getMoveDirections() { return this.moveDirections; }

    getMoveCount() { return this.moves; }

    getPosition() { return this.position; }

    getStartingSquare() { return this.startingSquare; }

    setImage(image: string) { this.image = image; }

    setMoveDirections(directions: Map<string, number>) { this.moveDirections = directions; }

    setPosition(pos: string) { this.position = pos; }

    setStartingSquare(square: Square) { this.startingSquare = square; }

}

export default Queen;
