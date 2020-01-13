import { IPiece } from './pieces/types';
import Pieces from './pieces/Pieces';
declare class PiecesFactory extends Pieces {
    typeOfPiece(piece: string): IPiece;
}
export default PiecesFactory;
