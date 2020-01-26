import { IPiece } from "./pieces/types";

class Player {
    private colour: string;
    private inCheck: boolean;
    private turnComplete: boolean;
    private castleQueenSide: boolean;
    private castleKingSide: boolean;
    private king!: IPiece;
    private isDemo!: boolean;

    constructor(colour: string) {
        this.colour = colour;
        this.inCheck = false;
        this.turnComplete = false;
        this.castleQueenSide = false;
        this.castleKingSide = false;
    }

    isInCheck() { return this.inCheck; }

    isDemonstrationMode() { return this.isDemo; }

    hasCompletedTurn() { return this.turnComplete; }

    canCastleQueenSide() { return this.castleQueenSide; }

    canCastleKingSide() { return this.castleKingSide; }

    getColour() { return this.colour; }

    getKing() { return this.king; }

    setDemonstrationMode() { this.isDemo = true; }

    setColour(colour: string) { this.colour = colour; }

    setCheckStatus(check: boolean) { this.inCheck = check; }

    setTurnComplete(completed: boolean) { this.turnComplete = completed; }

    setCanCastledQueenSide(canCastle: boolean) { this.castleQueenSide = canCastle; }

    setCanCastledKingSide(canCastle: boolean) { this.castleKingSide = canCastle; }

    setKing(king: IPiece) { this.king = king; }

}

export default Player;
