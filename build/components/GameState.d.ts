declare class GameState {
    private fenString;
    private currentTurn;
    private previousActivePiecePos;
    private nextActivePiecePos;
    getMoveState(): {
        prevMove: string;
        nextMove: string;
    };
    setMoveState(prev: string, next: string): void;
    getFenString(): string;
    getCurrentTurn(): string;
    setFenString(fen: string): void;
    setCurrentTurn(player: string): void;
}
export default GameState;
