- Add all remaining competitive stages (when done with these, verify that
    there aren't any other competitive stages left):
    - kalos pokemon league
    - lylat cruise
    - nc
    - pokemon stadium
    - pokemon stadium 2
    - sb
    - sv
    - town & city
    - unova pokemon league
    - yoshi's island
    - yoshi's story
- Make blocks scale perfectly (horizontal and vertical resolutions
    of each stage divisible by 64? Probably easier to just use an SVG,
    except that the entire system relies on pixels to work. This would
    also fix overlap and incomplete erasure.)
- Superimpose grid
- Fix error spam from drawing conditional
- Add manual save location
- Add/fix default save location reporting
- If possible, replace manual stage image imports with automatic ones
- Investigate whether there really need to be custom values
    per-stage, or whether, since FD and BF work with the
    same values, whatever is being derived is universal (and
    find out why, if possible.)
- Restore full Tauri support by fixing SSR.