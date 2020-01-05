class Player {
    private colour: string;
    private inCheck: boolean;
    private isDemo!: boolean;

    constructor(colour: string) {
        this.colour = colour;
        this.inCheck = false;
    }

    isInCheck() { return this.inCheck; }

    isDemonstrationMode() { return this.isDemo; }

    getColour() { return this.colour; }

    setDemonstrationMode() { this.isDemo = true; }

    setCheckStatus(check: boolean) { this.inCheck = check; }

}

export default Player;
