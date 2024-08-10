// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use mobius_app as mb;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![mb::generate_mobius_transformation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
