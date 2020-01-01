class Player {
    private colour: string;
    private inCheck: boolean;
    private colourInCheck!: string;

    constructor(colour: string) {
        this.colour = colour;
        this.inCheck = false;
    }

    isInCheck() { return this.inCheck; }

    getColour() { return this.colour; }

    getCheckColour() { return this.colourInCheck; }

    setCheckStatus(check: boolean) { this.inCheck = check; }

    setCheckColour(colour: string) { this.colourInCheck = colour; }

}

export default Player;
