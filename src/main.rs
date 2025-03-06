use std::thread;
use websocket_rs as websocket;

fn main() {
    // let event = websocket::init();

    thread::spawn(|| {
        websocket::serve();
    });

    let thread_join_handle = thread::spawn(move || {
        loop {
            // let recv = event.recv_msg();

            // let send = ;
            // event.send_msg(send.to_string());
        }
    });

    let _res = thread_join_handle.join();
}
