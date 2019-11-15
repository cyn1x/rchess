import { IPiece } from './types';
import Pieces from '../Pieces';

class King implements IPiece {
    type: string;
    colour: string;
    image: string;
    position!: string;
    moves!: number;
    moveDirections!: Map<string, number>;
    private inCheck!: boolean;
    private canCastle!: boolean;

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
    }

    incrementMoveNumber(move: number) {
        this.moves += move;
        this.setCastledStatus(false);
    }

    getType() { return this.type; }

    getColour() { return this.colour; }

    getImage() { return this.image; }

    getMoveDirections() { return this.moveDirections; }

    getPosition() { return this.position; }

    getMoveNumber() { return this.moves; }

    getCheckStatus() { return this.inCheck; }

    getCastleStatus() { return this.canCastle; }

    setImage(image: string) { this.image = image; }

    setMoveDirections(directions: Map<string, number>) { this.moveDirections = directions; }

    setPosition(pos: string) { this.position = pos; }

    setCheckStatus(check: boolean) { this.inCheck = check; }

    setCastledStatus(castled: boolean) { this.canCastle = castled; }

}

export default King;
