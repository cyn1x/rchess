import { IPiece, IKing } from './types';
import Pieces from './Pieces';
import Square from '../Square';

class King implements IPiece, IKing {
    type: string;
    colour: string;
    image: string;
    position!: string;
    moves!: number;
    moveDirections!: Map<string, number>;
    generalDefenceDirections!: Map<string, number>;
    knightDefenceDirections!: Map<string, number>;
    startingSquare!: Square;
    inCheck!: boolean;
    canCastle!: boolean;

    constructor(type: string, colour: string, image: string) {
        this.type = type;
        this.colour = colour;
        this.image = image;

        this.initialise();
    }

    initialise() {
        this.moves = 0;
        this.inCheck = false;
        this.canCastle = true;
        const pieces = new Pieces();

        this.setMoveDirections(pieces.kingMoves());
        this.setGeneralDefenceDirections(pieces.generalDefence());
        this.setKnightDefenceDirections(pieces.knightDefence());
    }

    incrementMoveCount() {
        this.moves += 1;
        this.setCastledStatus(false);
    }

    bIsInCheck() { return this.inCheck; }

    bCanCastle() { return this.canCastle; }

    getType() { return this.type; }

    getColour() { return this.colour; }

    getImage() { return this.image; }

    getMoveDirections() { return this.moveDirections; }

    getGeneralDefenceDirections() { return this.generalDefenceDirections; }

    getKnightDefenceDirections() { return this.knightDefenceDirections; }

    getPosition() { return this.position; }

    getMoveCount() { return this.moves; }

    getStartingSquare() { return this.startingSquare; }

    setImage(image: string) { this.image = image; }

    setMoveDirections(directions: Map<string, number>) { this.moveDirections = directions; }

    setGeneralDefenceDirections(directions: Map<string, number>) { this.generalDefenceDirections = directions; }

    setKnightDefenceDirections(directions: Map<string, number>) { this.knightDefenceDirections = directions; }

    setPosition(pos: string) { this.position = pos; }

    setStartingSquare(square: Square) { this.startingSquare = square; }

    setCheckStatus(check: boolean) { this.inCheck = check; }

    setCastledStatus(castled: boolean) { this.canCastle = castled; }

}

export default King;
