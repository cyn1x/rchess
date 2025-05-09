//! Core library functionality for the application.

// use std::thread;

// use websocket_rs::{self as websocket};

pub mod game;

pub fn run() {
    // let event = websocket::init();
    let _game = game::init();

    /*thread::spawn(|| {
        websocket::serve();
    });

    let thread_join_handle = thread::spawn(move || {
        loop {
            // let recv = event.recv_msg();
            // println!("{}", recv);

            // let send = "Hello from server";
            // event.send_msg(send.to_string());
        }
    });

    let _res = thread_join_handle.join();*/
}
