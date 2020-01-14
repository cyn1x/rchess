const initialState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class GameState {
    private fenString!: string;
    private currentTurn!: string;
    private previousActivePiecePos!: string;
    private nextActivePiecePos!: string;
    private fenCastlingState!: string;

    getMoveState() {
        const prevMove = this.previousActivePiecePos;
        const nextMove = this.nextActivePiecePos;

        return {prevMove, nextMove};
    }

    getFenString() { return this.fenString; }

    getCurrentTurn() { return this.currentTurn; }

    getFenCastlingState() { return this.fenCastlingState; }

    setMoveState(prev: string, next: string) {
        this.previousActivePiecePos = prev;
        this.nextActivePiecePos = next;
    }

    setFenString(fen: string) {
        if (fen === "") {
            this.fenString = initialState;
            return;
        }
        this.fenString = fen;
    }

    setCurrentTurn(player: string) { this.currentTurn = player; }

    setFenCastlingState(fen: string) {
        this.fenCastlingState = fen;
    }

}

export default GameState
