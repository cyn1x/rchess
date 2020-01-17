import Board from '../entities/Board';

class FenParser {
    private chessboard: Board;

    constructor(chessboard: Board) {
        this.chessboard = chessboard;
    }

    parseFenString(fen: string) {
        const fenString = fen.split(" ");
        const positions = fenString[0].split("/");
        const pieces = this.chessboard.getPiecePositionsArray();

        let currentSquare = 0;
        positions.forEach( rank => {
            rank.split("").forEach( char => {
                if (!Number(char)) {
                    pieces[currentSquare] = char;
                    currentSquare++;
                }
                else {
                    currentSquare += Number(char);
                }
            })
        })
        return pieces
    }

}

export default FenParser;
