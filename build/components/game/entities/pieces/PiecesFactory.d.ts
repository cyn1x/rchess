import { IPiece } from './types';
import Pieces from './Pieces';
declare class PiecesFactory extends Pieces {
    typeOfPiece(piece: string): IPiece;
}
export default PiecesFactory;
