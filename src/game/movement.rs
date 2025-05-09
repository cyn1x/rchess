//! Handles board bit shifts and individual bit movement

use super::board::Square;

const NOT_A_FILE: u64 = 0xfefefefefefefefe;
const NOT_H_FILE: u64 = 0x7f7f7f7f7f7f7f7f;
const NOT_AB_FILE: u64 = 0xfcfcfcfcfcfcfcfc;
const NOT_GH_FILE: u64 = 0x3f3f3f3f3f3f3f3f;

#[rustfmt::skip]
const SHIFT: [fn(u64) -> u64; 8] = [
    shift_north, shift_northeast, shift_east, shift_southeast,
    shift_south, shift_southwest, shift_west, shift_northwest
];

#[rustfmt::skip]
const KNIGHT_SHIFTS: [fn(u64) -> u64; 8] = [
    shift_north_north_east, shift_north_east_east,
    shift_south_east_east,  shift_south_south_east,
    shift_south_south_west, shift_south_west_west,
    shift_north_west_west,  shift_north_north_west
];

#[rustfmt::skip]
pub enum RayDirections {
    North, NorthEast, East, SouthEast,  
    South, SouthWest, West, NorthWest,
}

#[rustfmt::skip]
pub enum KnightDirections {
    NorthNorthEast = 0, NorthEastEast  = 1, SouthEastEast = 2,
    SouthSouthEast = 3, SouthSouthWest = 4, SouthWestWest = 5,
    NorthWestWest =  6, NorthNorthWest = 7,
}

pub fn shift(b: u64, direction: RayDirections) -> u64 { SHIFT[direction as usize](b) }

const fn shift_northwest(b: u64) -> u64 { (b << 7) & NOT_H_FILE }
const fn shift_north(b: u64) -> u64 { b << 8 }
const fn shift_northeast(b: u64) -> u64 { (b << 9) & NOT_A_FILE }
const fn shift_west(b: u64) -> u64 { (b >> 1) & NOT_H_FILE }
const fn shift_east(b: u64) -> u64 { (b << 1) & NOT_A_FILE }
const fn shift_southwest(b: u64) -> u64 { (b >> 9) & NOT_H_FILE }
const fn shift_south(b: u64) -> u64 { b >> 8 }
const fn shift_southeast(b: u64) -> u64 { (b >> 7) & NOT_A_FILE }

pub fn knight_shift(b: u64, direction: KnightDirections) -> u64 {
    KNIGHT_SHIFTS[direction as usize](b)
}

fn shift_north_north_east(b: u64) -> u64 { (b << 17) & NOT_A_FILE }
fn shift_north_east_east(b: u64) -> u64 { (b << 10) & NOT_AB_FILE }
fn shift_south_east_east(b: u64) -> u64 { (b >> 6) & NOT_AB_FILE }
fn shift_south_south_east(b: u64) -> u64 { (b >> 15) & NOT_A_FILE }
fn shift_south_south_west(b: u64) -> u64 { (b >> 17) & NOT_H_FILE }
fn shift_south_west_west(b: u64) -> u64 { (b >> 10) & NOT_GH_FILE }
fn shift_north_west_west(b: u64) -> u64 { (b << 6) & NOT_GH_FILE }
fn shift_north_north_west(b: u64) -> u64 { (b << 15) & NOT_H_FILE }

pub fn quiet_move(board: u64, from: Square, to: Square) -> u64 {
    let from_mask = 1u64 << from as u8;
    let to_mask = 1u64 << to as u8;
    board ^ (from_mask ^ to_mask)
}

pub fn capture_move(_b: u64) -> u64 { unimplemented!() }

#[cfg(test)]
mod tests {
    use super::*;
    use crate::game::board::Square;

    #[test]
    fn test_quiet_move() {
        let d2 = 1u64 << Square::D2.to_bit_index();

        // Test move north by one square
        let result = quiet_move(d2, Square::D2, Square::D3);
        assert_eq!(result, 1u64 << Square::D3.to_bit_index());
    }

    #[test]
    fn test_shift_directions() {
        let d4 = 1u64 << Square::D4.to_bit_index();

        // Test shift North
        let result = shift(d4, RayDirections::North);
        assert_eq!(result, 1u64 << Square::D5.to_bit_index());

        // Test shift South
        let result = shift(d4, RayDirections::South);
        assert_eq!(result, 1u64 << Square::D3.to_bit_index());

        // Test shift East
        let result = shift(d4, RayDirections::East);
        assert_eq!(result, 1u64 << Square::E4.to_bit_index());

        // Test shift West
        let result = shift(d4, RayDirections::West);
        assert_eq!(result, 1u64 << Square::C4.to_bit_index());

        // Test shift Northeast
        let result = shift(d4, RayDirections::NorthEast);
        assert_eq!(result, 1u64 << Square::E5.to_bit_index());

        // Test shift Northwest
        let result = shift(d4, RayDirections::NorthWest);
        assert_eq!(result, 1u64 << Square::C5.to_bit_index());

        // Test shift Southeast
        let result = shift(d4, RayDirections::SouthEast);
        assert_eq!(result, 1u64 << Square::E3.to_bit_index());

        // Test shift Southwest
        let result = shift(d4, RayDirections::SouthWest);
        assert_eq!(result, 1u64 << Square::C3.to_bit_index());
    }

    #[test]
    fn test_knight_shift_directions() {
        let d4 = 1u64 << Square::D4.to_bit_index();

        // Test shift North North East (2 up, 1 right)
        let result = knight_shift(d4, KnightDirections::NorthNorthEast);
        assert_eq!(result, 1u64 << Square::E6.to_bit_index());

        // Test shift North East East (1 up, 2 right)
        let result = knight_shift(d4, KnightDirections::NorthEastEast);
        assert_eq!(result, 1u64 << Square::F5.to_bit_index());

        // Test shift South East East (1 down, 2 right)
        let result = knight_shift(d4, KnightDirections::SouthEastEast);
        assert_eq!(result, 1u64 << Square::F3.to_bit_index());

        // Test shift South South East (2 down, 1 right)
        let result = knight_shift(d4, KnightDirections::SouthSouthEast);
        assert_eq!(result, 1u64 << Square::E2.to_bit_index());

        // Test shift South South West (2 down, 1 left)
        let result = knight_shift(d4, KnightDirections::SouthSouthWest);
        assert_eq!(result, 1u64 << Square::C2.to_bit_index());

        // Test shift South West West (1 down, 2 left)
        let result = knight_shift(d4, KnightDirections::SouthWestWest);
        assert_eq!(result, 1u64 << Square::B3.to_bit_index());

        // Test shift North West West (1 up, 2 left)
        let result = knight_shift(d4, KnightDirections::NorthWestWest);
        assert_eq!(result, 1u64 << Square::B5.to_bit_index());

        // Test shift North North West (2 up, 1 left)
        let result = knight_shift(d4, KnightDirections::NorthNorthWest);
        assert_eq!(result, 1u64 << Square::C6.to_bit_index());
    }

    #[test]
    fn test_shift_edge_cases() {
        let a1 = 1u64 << Square::A1.to_bit_index();
        let h8 = 1u64 << Square::H8.to_bit_index();

        // Test shifting from edge positions where no bits should shift

        // Test shifting southwest from A1
        let result = shift(a1, RayDirections::SouthWest);
        assert_eq!(result, 0); // no space southwest of A1

        // Test shifting west from A1
        let result = shift(a1, RayDirections::West);
        assert_eq!(result, 0); // no space west of A1

        // Test shifting north from H8
        let result = shift(h8, RayDirections::North);
        assert_eq!(result, 0); // no space north of H8

        // Test shifting northeast from H8
        let result = shift(h8, RayDirections::NorthEast);
        assert_eq!(result, 0); // no space northeast of H8
    }

    #[test]
    fn test_knight_shift_edge_cases() {
        let a1 = 1u64 << Square::A1.to_bit_index();
        let h8 = 1u64 << Square::H8.to_bit_index();

        // Test shifting south-easteast from A1
        let result = knight_shift(a1, KnightDirections::SouthEastEast);
        assert_eq!(result, 0); // no space southwest of A1

        // Test shifting south-westwest from A1
        let result = knight_shift(a1, KnightDirections::SouthWestWest);
        assert_eq!(result, 0); // no space southwest of A1

        // Test shifting north-northeast from H8
        let result = knight_shift(h8, KnightDirections::NorthNorthEast);
        assert_eq!(result, 0); // no space north of H8

        // Test shifting north-easteast from H8
        let result = knight_shift(h8, KnightDirections::NorthEastEast);
        assert_eq!(result, 0); // no space north of H8
    }
}
