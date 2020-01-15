declare class Player {
    private colour;
    private inCheck;
    private turnComplete;
    private canCastleQueenSide;
    private canCastleKingSide;
    private isDemo;
    constructor(colour: string);
    bIsInCheck(): boolean;
    bIsDemonstrationMode(): boolean;
    bHasCompletedTurn(): boolean;
    bCanCastleKingSide(): boolean;
    bCanCastleQueenSide(): boolean;
    getColour(): string;
    setDemonstrationMode(): void;
    setColour(colour: string): void;
    setCheckStatus(check: boolean): void;
    setTurnComplete(completed: boolean): void;
    setCanCastledQueenSide(canCastle: boolean): void;
    setCanCastledKingSide(canCastle: boolean): void;
}
export default Player;
