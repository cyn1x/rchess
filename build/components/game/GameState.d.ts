declare class GameState {
    private fenString;
    private currentTurn;
    private previousActivePiecePos;
    private nextActivePiecePos;
    private fenCastlingState;
    getMoveState(): {
        prevMove: string;
        nextMove: string;
    };
    getFenString(): string;
    getCurrentTurn(): string;
    getFenCastlingState(): string;
    setMoveState(prev: string, next: string): void;
    setFenString(fen: string): void;
    setCurrentTurn(player: string): void;
    setFenCastlingState(fen: string): void;
}
export default GameState;
