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
    setHasCastledQueenSide(): void;
    setHasCastledKingSide(): void;
}
export default Player;
