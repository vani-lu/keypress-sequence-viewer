# Keypress sequence viewer

A browser-based tool that turns keypress text into a horizontal sequence of SVG icons and exports it as a single SVG file.

## Usage

Open `index.html` in a modern browser. No installation, server, or network connection is required.

Paste a sequence separated by spaces, commas, tabs, or line breaks. The preview updates as you type. Use **Download SVG** to save a single horizontal strip of vector icons with a transparent background.

Example input:

```text
f-up, h-right, right, h-down, left, undo, restart
```

## Supported keys

Key names are case insensitive:

- Up: `up`, `ArrowUp`, `W`, `↑`
- Down: `down`, `ArrowDown`, `S`, `↓`
- Left: `left`, `ArrowLeft`, `A`, `←`
- Right: `right`, `ArrowRight`, `D`, `→`
- Undo: `undo`, `Z`
- Restart: `restart`, `R`

## Appearance and export

Mix arrow styles by prefixing any movement key with `f-` (filled) or `h-` (hollow), for example `f-up, h-right, h-W, f-←, undo`. The longer `filled-` and `hollow-` prefixes also work. Unprefixed movement keys use the default arrow style selector. Undo and restart do not take style prefixes.

Choose the default arrow style, icon size, spacing, and color. Unknown keys prevent export so that no keypress is silently omitted. Sequences are limited to 5,000 keypresses; long previews scroll horizontally.

The download has a transparent background and contains vector shapes without external image references. All input is processed locally in the browser.

Enable **Show operation index ruler** to include a ruler below the icons, in both the preview and downloaded SVG. Indexing starts at 1 and counts every token, including undo and restart. Each tick aligns with its icon's center; minor ticks are 8 px long, and every fifth tick is 12 px long and labeled (5, 10, 15, …). The ruler and its labels are black and stay aligned when size or spacing changes. It is shown by default and can be disabled with the checkbox.

## Project files

- `index.html`: page structure and input controls
- `styles.css`: page layout and appearance
- `app.js`: parsing, preview generation, and SVG download
- `assets/`: original SVG icons

`app.js` embeds copies of the assets so the page works directly from disk and downloaded SVGs contain their own shapes. If the source icons change, update the `ASSETS` constant to match.
