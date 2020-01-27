declare class GameState {
    private fenString;
    private currentTurn;
    private previousActivePiecePos;
    private nextActivePiecePos;
    private fenCastlingState;
    private halfmoveClock;
    private fullmoveClock;
    getMoveState(): {
        prevMove: string;
        nextMove: string;
    };
    getFenString(): string;
    getCurrentTurn(): string;
    getFenCastlingState(): string;
    getHalfmoveClock(): number;
    getFullmoveClock(): number;
    setMoveState(prev: string, next: string): void;
    setFenString(fen: string): void;
    setCurrentTurn(player: string): void;
    setFenCastlingState(fen: string): void;
    setHalfmoveClock(move: number): void;
    setFullmoveClock(move: number): void;
}
export default GameState;
