import GameState from '../GameState';
import Board from '../entities/Board';
import Player from '../entities/Player';

class FenBuilder {
    private gameState: GameState;
    private chessboard: Board;
    private player: Player;

    constructor(gameState: GameState, chessboard: Board, player: Player) {
        this.gameState = gameState;
        this.chessboard = chessboard;
        this.player = player;
    }

    createFenPositions() {
        const board = this.chessboard.getSquaresArray();
        let newFenString = "";
        let emptySquares = 0;
        for (let i = 0; i < board.length; i++) {
            
            if (i % 8 === 0 && i !== 0) {
                newFenString += "/"
                emptySquares = 0;
            }
            
            if (board[i].squareContainsPiece()) {
                newFenString += board[i].getPiece().getType();
                emptySquares = 0;
            }
            else {
                emptySquares++;
                if ((i + 1) < board.length) {
                    if ((i + 1) % 8 === 0) {
                        newFenString += emptySquares;
                    }
                    else if (board[i + 1].squareContainsPiece()) {
                        newFenString += emptySquares;
                    }
                }
            }
        }

        return newFenString;
    }

    createFenCurrentTurn() {
        const currentTurn = this.gameState.getCurrentTurn();
        const fenCurrentTurn = (currentTurn[0] === "W" ? " w " : " b ");

        return fenCurrentTurn;
    }

    createFenCastlingStatus() {
        let fenCastlingState = "";

        if (this.player.getColour() === "White") {
            if (this.player.canCastleKingSide()) {
                fenCastlingState += "K";
            }
            if (this.player.canCastleQueenSide()) {
                fenCastlingState += "Q";
            }

            fenCastlingState += this.appendFenCastlingBlackStatus();
        }
        else if (this.player.getColour() === "Black") {
            fenCastlingState = this.appendFenCastlingWhiteStatus();

            if (this.player.canCastleKingSide()) {
                fenCastlingState += "k";
            }
            if (this.player.canCastleQueenSide()) {
                fenCastlingState += "q";
            }
        }

        if (fenCastlingState.length === 0) {
            return "-";
        }

        this.gameState.setFenCastlingState(fenCastlingState);

        return fenCastlingState;
    }

    appendFenCastlingWhiteStatus() {
        let fenWhiteCastlingState = "";

        this.gameState.getFenCastlingState().split("").forEach(char => {
            switch(char) {
                case "K": fenWhiteCastlingState += char;
                    break;
                case "Q": fenWhiteCastlingState += char;
                    break;
            }
        })

        return fenWhiteCastlingState;
    }

    appendFenCastlingBlackStatus() {
        let fenBlackCastlingState = "";

        this.gameState.getFenCastlingState().split("").forEach(char => {
            switch(char) {
                case "k": fenBlackCastlingState += char;
                    break;
                case "q": fenBlackCastlingState += char;
                    break;
            }
        })

        return fenBlackCastlingState;
    }

    createFenEnPassantSquare() {
        const enPassantSquare = this.chessboard.getEnPassantSquare();
        const fenEnPassantSquare = (enPassantSquare ? " " + enPassantSquare.getPosition() + " " : " - ")

        return fenEnPassantSquare;
    }

    createFenHalfmoveClock() { return this.gameState.getHalfmoveClock() + " "; }

    createFenFullmoveClock() { return this.gameState.getFullmoveClock(); }

}

export default FenBuilder;
