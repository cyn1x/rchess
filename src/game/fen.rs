//! Parser for FEN strings

const DEFAULT_FEN: &str = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

pub fn from_fen() -> Vec<(u8, char)> {
    let (positions, _state): (&str, &str) = match DEFAULT_FEN.split_once(' ') {
        Some(pair) => pair,
        None => {
            eprintln!("Invalid FEN string");
            return [].to_vec();
        }
    };

    let merged_ranks = positions
        .split('/')
        .collect::<Vec<&str>>()
        .join("");

    let mut squares: Vec<(u8, char)> = Vec::new();
    let mut target_square = 0;

    for c in merged_ranks.chars() {
        if c.is_ascii_digit() {
            target_square += c.to_digit(10).unwrap();
            for _ in 0..target_square {
                squares.push((target_square as u8, c));
            }
        } else if c.is_ascii() {
            squares.push((target_square as u8, c));
            target_square += 1;
        }
    }

    squares
}

pub fn to_fen(_b: u64) -> String { todo!() }
