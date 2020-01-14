class Player {
    private colour: string;
    private inCheck: boolean;
    private turnComplete: boolean;
    private canCastleQueenSide: boolean;
    private canCastleKingSide: boolean;
    private isDemo!: boolean;

    constructor(colour: string) {
        this.colour = colour;
        this.inCheck = false;
        this.turnComplete = false;
        this.canCastleQueenSide = false;
        this.canCastleKingSide = false;
    }

    bIsInCheck() { return this.inCheck; }

    bIsDemonstrationMode() { return this.isDemo; }

    bHasCompletedTurn() { return this.turnComplete; }

    bCanCastleKingSide() { return this.canCastleKingSide; }

    bCanCastleQueenSide() { return this.canCastleQueenSide; }

    getColour() { return this.colour; }

    setDemonstrationMode() { this.isDemo = true; }

    setColour(colour: string) { this.colour = colour; }

    setCheckStatus(check: boolean) { this.inCheck = check; }

    setTurnComplete(completed: boolean) { this.turnComplete = completed; }

    setCanCastledQueenSide(canCastle: boolean) { this.canCastleQueenSide = canCastle; }

    setCanCastledKingSide(canCastle: boolean) { this.canCastleKingSide = canCastle; }

}

export default Player;
