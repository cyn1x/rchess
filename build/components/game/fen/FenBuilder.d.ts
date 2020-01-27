import GameState from '../GameState';
import Board from '../entities/Board';
import Player from '../entities/Player';
declare class FenBuilder {
    private gameState;
    private chessboard;
    private player;
    constructor(gameState: GameState, chessboard: Board, player: Player);
    createFenPositions(): string;
    createFenCurrentTurn(): " w " | " b ";
    createFenCastlingStatus(): string;
    appendFenCastlingWhiteStatus(): string;
    appendFenCastlingBlackStatus(): string;
    createFenEnPassantSquare(): string;
    createFenHalfmoveClock(): string;
    createFenFullmoveClock(): number;
}
export default FenBuilder;
