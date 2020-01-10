class Player {
    private colour: string;
    private inCheck: boolean;
    private turnComplete: boolean;
    private isDemo!: boolean;

    constructor(colour: string) {
        this.colour = colour;
        this.inCheck = false;
        this.turnComplete = false;
    }

    bIsInCheck() { return this.inCheck; }

    bIsDemonstrationMode() { return this.isDemo; }

    bHasCompletedTurn() { return this.turnComplete; }

    getColour() { return this.colour; }

    setDemonstrationMode() { this.isDemo = true; }

    setColour(colour: string) { this.colour = colour; }

    setCheckStatus(check: boolean) { this.inCheck = check; }

    setTurnComplete(completed: boolean) { this.turnComplete = completed; }
}

export default Player;
