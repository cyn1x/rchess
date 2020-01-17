class GameState {
    private fenString!: string;
    private currentTurn!: string;
    private previousActivePiecePos!: string;
    private nextActivePiecePos!: string;
    private fenCastlingState!: string;
    private halfmoveClock!: number;
    private fullmoveClock!: number;

    getMoveState() {
        const prevMove = this.previousActivePiecePos;
        const nextMove = this.nextActivePiecePos;

        return {prevMove, nextMove};
    }

    getFenString() { return this.fenString; }

    getCurrentTurn() { return this.currentTurn; }

    getFenCastlingState() { return this.fenCastlingState; }

    getHalfmoveClock() { return this.halfmoveClock; }

    getFullmoveClock() { return this.fullmoveClock; }

    setMoveState(prev: string, next: string) {
        this.previousActivePiecePos = prev;
        this.nextActivePiecePos = next;
    }

    setFenString(fen: string) { this.fenString = fen; }

    setCurrentTurn(player: string) { this.currentTurn = player; }

    setFenCastlingState(fen: string) { this.fenCastlingState = fen; }

    setHalfmoveClock(move: number) { this.halfmoveClock = move; }

    setFullmoveClock(move: number) { this.fullmoveClock = move; }

}

export default GameState
