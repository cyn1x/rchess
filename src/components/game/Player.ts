class Player {
    private colour: string;
    private inCheck: boolean;

    constructor(colour: string) {
        this.colour = colour;
        this.inCheck = false;
    }

    getColour() { return this.colour; }

    getCheckStatus() { return this.inCheck; }

    setCheckStatus(check: boolean) { this.inCheck = check; }

}

export default Player;
