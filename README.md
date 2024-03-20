# StageViewer
A tool to visualize Steve builds in Super Smash Brothers Ultimate. Currently
a work in progress, expect significant changes over time, including the addition
of new stages.

## Credit

Stage images are from
[Tournameta's Stage Comparison Tool](https://tournameta.com/ssbu-stage-comparison),
used with permission.

Block textures are from the
[Coterie Craft texture pack](https://www.curseforge.com/minecraft/texture-packs/coterie-craft-16x),
licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
You can add your own textures before building, for example if you want to use
the official Minecraft textures. Simply replace the block texture files distributed
with the project with files with the same sizes and names.

NOT AN OFFICIAL MINECRAFT PRODUCT.
NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.

## Building

Currently, official builds are not provided. They will be provided when the
project is more complete. For now, you can build it yourself. Currently, only
Linux is fully supported, with Windows support available via in-progress
cross-compilation. You will need the Rust toolchain and the Node package manager.

1. Clone this repository and `cd` into it.
2. Run `cargo install` and `npm install` to install dependencies.
3. Run `npm run dev` to compile the frontend code. (`npm run build` and `npm run preview` work but are not currently compatible with Tauri.)
4. Tauri support is in-progress. Run `npm run preview` and `cargo run dev` to compile and run the Tauri application, but note that currently, due to SSR issues, the Tauri app will only work while the preview server is running, and `cargo run --release` doesn't yet work.
