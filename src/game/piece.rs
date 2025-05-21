//! Piece type definitions

#[allow(dead_code)]
pub const UNICODE: [[char; 2]; 6] = [
    ['♙', '♟'],
    ['♘', '♞'],
    ['♗', '♝'],
    ['♖', '♜'],
    ['♕', '♛'],
    ['♔', '♚'],
];

/* Chess piece representation */

#[derive(Copy, Clone)]
#[rustfmt::skip]
#[repr(u8)]
pub enum PieceType {
    Pawn, Knight, Bishop,
    Rook, Queen,  King
}

#[rustfmt::skip]
#[repr(u8)]
pub enum Color {
    White, Black
}

pub fn color_code(p: char) -> u8 {
    if p.is_ascii_uppercase() {
        return Color::White as u8;
    }
    Color::Black as u8
}

pub fn piece_code(c: char) -> Option<PieceType> {
    let piece = match c.to_ascii_lowercase() {
        'p' => PieceType::Pawn,
        'n' => PieceType::Knight,
        'b' => PieceType::Bishop,
        'r' => PieceType::Rook,
        'q' => PieceType::Queen,
        'k' => PieceType::King,
        _ => return None,
    };

    Some(piece)
}
