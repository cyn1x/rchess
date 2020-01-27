import { IPiece } from "./pieces/types";
declare class Player {
    private colour;
    private inCheck;
    private turnComplete;
    private castleQueenSide;
    private castleKingSide;
    private king;
    private isDemo;
    constructor(colour: string);
    isInCheck(): boolean;
    isDemonstrationMode(): boolean;
    hasCompletedTurn(): boolean;
    canCastleQueenSide(): boolean;
    canCastleKingSide(): boolean;
    getColour(): string;
    getKing(): IPiece;
    setDemonstrationMode(): void;
    setColour(colour: string): void;
    setCheckStatus(check: boolean): void;
    setTurnComplete(completed: boolean): void;
    setCanCastledQueenSide(canCastle: boolean): void;
    setCanCastledKingSide(canCastle: boolean): void;
    setKing(king: IPiece): void;
}
export default Player;
