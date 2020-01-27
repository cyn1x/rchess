import Board from '../entities/Board';
declare class FenParser {
    private chessboard;
    constructor(chessboard: Board);
    parseFenString(fen: string): string[];
}
export default FenParser;
