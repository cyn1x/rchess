//! Chessboard structure and generation

#[macro_export]
macro_rules! get_bit {
    ($bitboard:expr, $square:expr) => {
        $bitboard & (1u64 << $square as u8)
    };
}

#[macro_export]
macro_rules! set_bit {
    ($bitboard:expr, $square:expr) => {
        $bitboard |= (1u64 << $square as u8)
    };
}

#[macro_export]
macro_rules! pop_bit {
    ($bitboard:expr, $square:expr) => {
        $bitboard ^= 1u64 << $square as u8
    };
}

#[rustfmt::skip]
#[repr(u8)]
pub enum Square {
    A1, B1, C1, D1, E1, F1, G1, H1,
    A2, B2, C2, D2, E2, F2, G2, H2,
    A3, B3, C3, D3, E3, F3, G3, H3,
    A4, B4, C4, D4, E4, F4, G4, H4,
    A5, B5, C5, D5, E5, F5, G5, H5,
    A6, B6, C6, D6, E6, F6, G6, H6,
    A7, B7, C7, D7, E7, F7, G7, H7,
    A8, B8, C8, D8, E8, F8, G8, H8
}

impl Square {
    pub fn to_bit_index(self) -> u8 { self as u8 }
}

#[derive(Debug)]
pub struct Bitboard {
    pub bitboard: u64,
}

impl Bitboard {
    pub fn new() -> Self { Self { bitboard: 0u64 } }

    pub fn set_square(&mut self, square: Square) {
        set_bit!(self.bitboard, square);
    }

    pub fn pretty_print(&self) {
        println!();
        for rank in (0..8).rev() {
            print!("{}  ", rank + 1);

            for file in 0..8 {
                let square = rank * 8 + file;
                let bit = if get_bit!(self.bitboard, square) != 0 {
                    1
                } else {
                    0
                };
                print!(" {:b}", bit);
            }
            println!();
        }
        println!("\n    a b c d e f g h");
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_square_to_bit_index() {
        assert_eq!(Square::A1.to_bit_index(), 0);
        assert_eq!(Square::D4.to_bit_index(), 27);
        assert_eq!(Square::H8.to_bit_index(), 63);
    }
}
