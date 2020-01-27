import { IPiece } from '../entities/pieces/types';

import GameData from '../GameData';
import Board from '../entities/Board';
import Square from '../entities/Square';
import Rook from '../entities/pieces/Rook';
import Pawn from '../entities/pieces/Pawn';
import Player from '../entities/Player';

class SpecialMoveHandler implements Logic {
    private chessboard: Board;
    private gameData: GameData;

    constructor(gameData: GameData, chessboard: Board) {
        this.gameData = gameData;
        this.chessboard = chessboard;
    }

    determineEnPassantSquare(enPassantSquare: string) {
        if (enPassantSquare !== "-") {
            const squaresArray = this.chessboard.getSquaresArray();
            const files = this.chessboard.getFiles();
            
            const pos = enPassantSquare;
            let file = files.indexOf(pos[0]);
            const rank = Number(pos[1]);
            const targetSquareIndex = this.calculateArrayIndex(file, rank);

            squaresArray[targetSquareIndex].setEnPassantSquare(true);
            this.chessboard.setEnPassantSquare(squaresArray[targetSquareIndex]);
        }
    }

    enPassantOpeningDeterminant(attackedSquare: Square) {
        const squaresArray = this.chessboard.getSquaresArray();
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();

        if (activePiece instanceof Pawn) {
            if (activePiece.getMoveCount() !== 0) { return; }

            const files = this.chessboard.getFiles();
            
            const pos = attackedSquare.getPosition();
            const file = files.indexOf(pos[0]);
            const rank = (activePiece.getColour() === "White" ? Number(pos[1]) - 1 : Number(pos[1]) + 1);
            const targetSquareIndex = this.calculateArrayIndex(file, rank);

            const oldPos = activeSquare.getPosition();
            const oldFile = files.indexOf(oldPos[0])
            const oldRank = (activePiece.getColour() === "White" ? Number(oldPos[1]) + 1 : Number(oldPos[1]) - 1);
            const activeSquareIndex = this.calculateArrayIndex(oldFile, oldRank);

            if (squaresArray[targetSquareIndex] === squaresArray[activeSquareIndex]) {
                squaresArray[targetSquareIndex].setEnPassantSquare(true);
                this.chessboard.setEnPassantSquare(squaresArray[targetSquareIndex]);
            }
        }
    }

    enPassantCaptureDeteriminant(piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();
        const attackedSquares = this.gameData.getAttackedSquares();
        
        const files = this.chessboard.getFiles();
        
        const pos = activePiece.getPosition();
        const northEastFile = files.indexOf(pos[0]) + 1;
        const northEastRank = (activePiece.getColour() === "White" ? Number(pos[1]) + 1 : Number(pos[1]) - 1);
        const northEastSquareIndex = this.calculateArrayIndex(northEastFile, northEastRank);

        const northWestFile = files.indexOf(pos[0]) - 1;
        const northWestRank = (activePiece.getColour() === "White" ? Number(pos[1]) + 1 : Number(pos[1]) - 1);
        const northWestSquareIndex = this.calculateArrayIndex(northWestFile, northWestRank);

        if (squaresArray[northEastSquareIndex].isEnPassantSquare()) {
            attackedSquares.push(squaresArray[northEastSquareIndex]);
        }
        else if (squaresArray[northWestSquareIndex].isEnPassantSquare()) {
            attackedSquares.push(squaresArray[northWestSquareIndex])
        }
    }

    performEnPassantCapture(attackedSquare: Square) {
        const squaresArray = this.chessboard.getSquaresArray();
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();

        const files = this.chessboard.getFiles();
        
        const pos = attackedSquare.getPosition();
        const capturedPawnFile = files.indexOf(pos[0]);
        const capturedPawnRank = (activePiece.getColour() === "White" ? Number(pos[1]) - 1 : Number(pos[1]) + 1);
        const capturedPawnSquareIndex = this.calculateArrayIndex(capturedPawnFile, capturedPawnRank);
        const capturedSquare = squaresArray[capturedPawnSquareIndex];

        this.gameData.setCapturedPiece(capturedSquare.getPiece());
        capturedSquare.removePiece();
        
        return capturedSquare;
    }

    kingCanCastleDeterminant(player: Player) {
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();
        
        if (activePiece.getColour() === "White" && activePiece.getColour() === player.getColour()) {
            if (activeSquare.getPosition() === "E1") {
                player.setCanCastledKingSide(false);
                player.setCanCastledQueenSide(false);
            }
        }
        else if (activePiece.getColour() === "Black" && activePiece.getColour() === player.getColour()) {
            if (activePiece.getPosition() === "E8") {
                player.setCanCastledKingSide(false);
                player.setCanCastledQueenSide(false);
            }
        }
    }

    rookCanCastleDeterminant(player: Player) {
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();

        if (activePiece.getColour() === "White" && activePiece.getColour() === player.getColour()) {
            if (activeSquare.getPosition() === "A1") {
                player.setCanCastledQueenSide(false);
            }
            else if (activeSquare.getPosition() === "H1") {
                player.setCanCastledKingSide(false);
            }
        }
        else if (activePiece.getColour() === "Black" && activePiece.getColour() === player.getColour()) {
            if (activeSquare.getPosition() === "A8") {
                player.setCanCastledQueenSide(false);
            }
            else if (activeSquare.getPosition() === "H8") {
                player.setCanCastledKingSide(false);
            }
        }
    }

    westCastlingDeterminant(pos: string) {
        const squaresArray = this.chessboard.getSquaresArray();
        const attackedSquares = this.gameData.getAttackedSquares();
        const files = this.chessboard.getFiles();
        
        let file = files.indexOf(pos[0]);
        const rank = Number(pos[1]);
        const firstSquareInRow = 0;

        while (file != firstSquareInRow) {
            file = file - 1;
            const targetSquareIndex = this.calculateArrayIndex(file, rank);
            if (this.kingPassesThroughAttackedSquare(targetSquareIndex, file)) { return false }
            if (!this.kingCanCastle(targetSquareIndex, file)) { return false; }
        }
        
        file = files.indexOf(pos[0]) - 2;
        const targetSquareIndex = this.calculateArrayIndex(file, rank);
        squaresArray[targetSquareIndex].setCastlingSquare(true);
        this.chessboard.setWestCastlingSquare(squaresArray[targetSquareIndex]);
        attackedSquares.push(squaresArray[targetSquareIndex]);
    }

    eastCastlingDeterminant(pos: string) {
        const squaresArray = this.chessboard.getSquaresArray();
        const attackedSquares = this.gameData.getAttackedSquares();
        const files = this.chessboard.getFiles();
        
        let file = files.indexOf(pos[0]);
        const rank = Number(pos[1]);
        const lastSquareInRow = 7;

        while (file != lastSquareInRow) {
            file = file + 1;
            const targetSquareIndex = this.calculateArrayIndex(file, rank);
            if (this.kingPassesThroughAttackedSquare(targetSquareIndex, file)) { return false }
            if (!this.kingCanCastle(targetSquareIndex, file)) { return false; }
        }

        file = files.indexOf(pos[0]) + 2;
        const targetSquareIndex = this.calculateArrayIndex(file, rank);
        squaresArray[targetSquareIndex].setCastlingSquare(true);
        this.chessboard.setEastCastlingSquare(squaresArray[targetSquareIndex]);
        attackedSquares.push(squaresArray[targetSquareIndex]);
    }

    castleRookQueenSide(square: Square) {
        const squaresArray = this.chessboard.getSquaresArray();
        const files = this.chessboard.getFiles();

        const pos = square.getPosition();
        const file = files.indexOf(pos[0]) - 2;
        const rank = Number(pos[1]);
        const queenSideRookSquareIndex = this.calculateArrayIndex(file, rank);

        const newRookPos = square.getPosition();
        const newRookFile = files.indexOf(newRookPos[0]) + 1;
        const newRookRank = Number(newRookPos[1]);
        const newRookPosSquareIndex = this.calculateArrayIndex(newRookFile, newRookRank);

        squaresArray[newRookPosSquareIndex].setPiece(squaresArray[queenSideRookSquareIndex].getPiece());
        squaresArray[queenSideRookSquareIndex].removePiece();

        return queenSideRookSquareIndex;
    }

    castleRookKingSide(square: Square) {
        const squaresArray = this.chessboard.getSquaresArray();
        const files = this.chessboard.getFiles();

        const pos = square.getPosition();
        const file = files.indexOf(pos[0]) + 1;
        const rank = Number(pos[1]);
        const kingSideRookSquareIndex = this.calculateArrayIndex(file, rank);

        const newRookPos = square.getPosition();
        const newRookFile = files.indexOf(newRookPos[0]) - 1;
        const newRookRank = Number(newRookPos[1]);
        const newRookPosSquareIndex = this.calculateArrayIndex(newRookFile, newRookRank);

        squaresArray[newRookPosSquareIndex].setPiece(squaresArray[kingSideRookSquareIndex].getPiece());
        squaresArray[kingSideRookSquareIndex].removePiece();

        return kingSideRookSquareIndex;
    }

    kingPassesThroughAttackedSquare(targetSquareIndex: number, file: number) {
        const squaresArray = this.chessboard.getSquaresArray();

        if (file === 3 || file === 2 || file === 5 || file === 6) {
            const attackingPieces = squaresArray[targetSquareIndex].getAttackingPiece();
            const activePiece = this.chessboard.getActiveSquare().getPiece();

            for (let i = 0; i < attackingPieces.length; i++) {
                if (attackingPieces[i].getColour() !== activePiece.getColour()) { return true; }
            }
        }
    }

    kingCanCastle(targetSquareIndex: number, file: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const firstSquareInRow = 0;
        const lastSquareInRow = 7;

        if ((file === firstSquareInRow || file === lastSquareInRow)) {
            return (squaresArray[targetSquareIndex].squareContainsPiece() && this.rookCanCastle(squaresArray, targetSquareIndex));
        }
        else {
            return (!this.castlingMoveIsObstructed(squaresArray, targetSquareIndex));
        }
    }

    castlingMoveIsObstructed(squaresArray: Array<Square>, targetSquareIndex: number) {
        return squaresArray[targetSquareIndex].squareContainsPiece();
    }

    rookCanCastle(squaresArray: Array<Square>, targetSquareIndex: number) {
        const piece = squaresArray[targetSquareIndex].getPiece();
        if (piece instanceof Rook) {
            return (piece.canCastle());
        }
    }

    calculateArrayIndex(file: number, rank: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const boardLength = squaresArray.length / 8;

        return (boardLength - rank) * boardLength + file;
    }    

}

export default SpecialMoveHandler;
