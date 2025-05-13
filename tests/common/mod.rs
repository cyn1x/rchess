extern crate rchess;

use rchess::game::board::{Bitboard, Square};

pub fn bitboard_with_square(square: Square) -> Bitboard {
    let mut board = Bitboard::default();
    Bitboard::set_square(&mut board.empty, square);
    board
}
