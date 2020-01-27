import { IPiece } from '../entities/pieces/types';
import GameData from '../GameData';
import Board from '../entities/Board';
import Square from '../entities/Square';
import Player from '../entities/Player';
declare class SpecialMoveHandler implements Logic {
    private chessboard;
    private gameData;
    constructor(gameData: GameData, chessboard: Board);
    determineEnPassantSquare(enPassantSquare: string): void;
    enPassantOpeningDeterminant(attackedSquare: Square): void;
    enPassantCaptureDeteriminant(piece: IPiece): void;
    performEnPassantCapture(attackedSquare: Square): Square;
    kingCanCastleDeterminant(player: Player): void;
    rookCanCastleDeterminant(player: Player): void;
    westCastlingDeterminant(pos: string): false | undefined;
    eastCastlingDeterminant(pos: string): false | undefined;
    castleRookQueenSide(square: Square): number;
    castleRookKingSide(square: Square): number;
    kingPassesThroughAttackedSquare(targetSquareIndex: number, file: number): true | undefined;
    kingCanCastle(targetSquareIndex: number, file: number): boolean | undefined;
    castlingMoveIsObstructed(squaresArray: Array<Square>, targetSquareIndex: number): boolean;
    rookCanCastle(squaresArray: Array<Square>, targetSquareIndex: number): boolean | undefined;
    calculateArrayIndex(file: number, rank: number): number;
}
export default SpecialMoveHandler;
