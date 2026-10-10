# Keypress sequence viewer

A browser-based tool that turns keypress text and optional abstraction ranges into a horizontal SVG visualization. It displays operations, lower abstraction segments, and higher abstraction segments on a shared axis and exports them as one self-contained SVG file.

## Usage

Open `index.html` in a modern browser. No installation, server, or network connection is required.

Enter a sequence separated by spaces, commas, tabs, or line breaks in **Operations**. Enter segment ranges in the separate **Lower abstraction ranges** and **Higher abstraction ranges** fields. The preview updates as you type. Use **Download SVG** to save a single horizontal strip of vector icons with a transparent background.

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

## Abstraction ranges

Use ranges instead of a table to define the hierarchy. For example:

```text
Operations: h-right, f-up, restart, h-left, f-right, h-down
Lower abstraction ranges: 1-2, 4, 5-6
Higher abstraction ranges: 1-2, 4-6
```

Enter only the values after each colon in the corresponding field. Each comma-separated range is one distinct segment; a single number creates a one-operation segment. Range endpoints are inclusive and use operation indices starting at 1. Spaces or line breaks can also separate ranges. Adjacent ranges remain separate segments. Overlapping, reversed, or out-of-bounds ranges prevent export and show an error. Restart counts as an operation but must be excluded from all ranges; split any range around it. Leaving a range field empty omits its segments, and unlisted operations leave gaps. Inputs do not require Markdown tables or segment IDs.

The 52-operation example loads on page opening; **Try an example** restores all three sequence/range fields and leaves appearance settings as selected. Its higher abstraction ranges are `1-18, 20-40, 41-44, 45-52`, with Restart at operation 19. Its 32 lower abstraction ranges are:

```text
1-4, 5, 6, 7, 8, 9-11, 12, 13, 14, 15, 16, 17, 18, 20-21, 22, 23, 24, 25, 26-32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45-52
```

## Appearance and export

The appearance controls update both the preview and downloaded SVG:

| Control | Default | Effect |
|---|---|---|
| Default arrow style | Filled | Style of movement tokens without a prefix |
| Icon size | 48 px | Operation icon dimensions |
| Lower abstraction height | 46 px | Independent height of the lower rectangles |
| Higher abstraction height | 46 px | Independent height of the higher rectangles |
| Spacing | 12 px | Horizontal gap between icon boxes |
| Segment gap | 8 px | Horizontal gap between adjacent segment rectangles |
| Layer gap | 24 px | Vertical spacing between higher/lower abstraction and lower abstraction/icon boxes |
| Connector extra gap | 16 px | Added to both layer gaps when connectors are enabled; hidden when disabled |
| Corner radius | 12 px | Corner radius of both abstraction layers, limited to half the rectangle width/height |
| Icon color | `#62696b` | Movement, undo, and restart icon color |
| Lower abstraction color | `#2F95CA` | Lower layer fill and outline color |
| Higher abstraction color | `#885BB5` | Higher layer fill and outline color |
| Show operation index ruler | Enabled | Include centered ticks and every-fifth-operation labels |
| Show hierarchy connectors | Enabled | Gray branches connecting higher segments to lower segments and lower segments to operations |

The SVG places Lower abstraction above the operations and Higher abstraction above Lower abstraction. Both lanes have rounded corners (up to 12 px radius) and 3.75 px outlines, and have independently editable heights (46 px each by default), with Lower abstraction defaulting to `#2F95CA` and Higher abstraction to `#885BB5` at 40% fill opacity. Separate **Lower abstraction color** and **Higher abstraction color** pickers update the fill and outline colors in both preview and export. Segment IDs, visible titles, layer labels, legends, and Restart guide lines are omitted from the image; only ruler tick labels remain. Preview and download use the same SVG.

Mix arrow styles by prefixing any movement key with `f-` (filled) or `h-` (hollow), for example `f-up, h-right, h-W, f-←, undo`. The longer `filled-` and `hollow-` prefixes also work. Unprefixed movement keys use the default arrow style selector. Undo and restart do not take style prefixes.

Choose the default arrow style, icon size, spacing, and color. Unknown keys prevent export so that no keypress is silently omitted. Sequences are limited to 5,000 keypresses; long previews scroll horizontally.

**Segment gap** controls horizontal spacing between adjacent rectangles in each layer (8 px by default), independently of operation icon spacing. It trims each rectangle equally at both ends, keeping the original boundary midpoint and ruler alignment. The maximum is the smaller of 128 px and icon size minus 2 px, so single-operation rectangles remain visible.

Operation SVG boxes share the same vertical position and retain their internal padding. This gives the visible arrow shapes more space below Lower abstraction than the gap between the two rectangle layers.

**Layer gap** adjusts both vertical gaps together (0–128 px). It is measured between the layer boxes; icon padding and rectangle outlines affect the visible shape-to-shape distance. Changing this setting moves the operation row and its ruler together and updates the export height.

Enabling hierarchy connectors reveals **Connector extra gap** (0–128 px, default 16 px). It adds to each vertical gap on top of **Layer gap**, so the default effective gap is 40 px. Turning connectors off hides the extra-gap field and uses only **Layer gap**. The extra-gap value is retained for the next time connectors are enabled. Both preview and export update immediately.

**Corner radius** adjusts both abstraction layers together (0–128 px). Set it to 0 for square corners. The effective radius is limited to half the rectangle width or height so narrow segments remain valid. It updates both preview and export.

**Show hierarchy connectors** draws fully opaque gray (`#a6a6a6`) branches with 2.5 px strokes between all three layers, behind their rectangles and icons, in both preview and export. Lower segments wholly outside the higher ranges have no higher-level connection but still connect to their own operations. A lower segment that intersects a higher range must fit entirely within one higher segment; crossing a higher boundary shows an error asking you to fix the ranges or turn connectors off. Restart stays disconnected. Each lower segment branches to its member operations, with all operation branches stopping 2 visible pixels above the top of an Up arrow, accounting for their rounded stroke ends. Empty layers produce no connections for that level.

**Lower abstraction height** and **Higher abstraction height** independently control rectangle heights (8–256 px). Changing icon size no longer changes the abstraction heights. Connectors, lower-layer positions, operations, ruler, and export bounds adapt to the selected heights. At the default settings, both rectangles are 46 px high with 24 px layer gaps. Their fills use 40% opacity and their outlines are fully opaque. The color pickers change the underlying colors while these opacity settings remain fixed.

The download has a transparent background and contains vector shapes without external image references. All input is processed locally in the browser.

Enable **Show operation index ruler** to include a ruler below the icons, in both the preview and downloaded SVG. Indexing starts at 1 and counts every token, including undo and restart. Each tick aligns with its icon's center; minor ticks are 8 px long, and every fifth tick is 12 px long and labeled (5, 10, 15, …). The baseline and all ticks have a 2 px stroke; labels are 28 px. The ruler and its labels are black and stay aligned when size or spacing changes. It is shown by default and can be disabled with the checkbox. The horizontal axis represents operation order, rather than elapsed time.

The export reserves space below the larger labels and adds horizontal margins when needed to keep end labels inside the SVG. These margins do not change icon centers or tick alignment.

## Project files

- `index.html`: page structure and input controls
- `styles.css`: page layout and appearance
- `app.js`: parsing, preview generation, and SVG download
- `assets/`: original SVG icons
- `tests/app.test.cjs`: dependency-free parsing, SVG geometry, and control-wiring checks

`app.js` embeds copies of the assets so the page works directly from disk and downloaded SVGs contain their own shapes. If the source icons change, update the `ASSETS` constant to match.

## Validation

Run `node tests/app.test.cjs` to check range validation, sample segment membership, Restart gaps, rectangle geometry, tick alignment, live input updates, and independent abstraction colors. Run `node --check app.js` for JavaScript syntax validation.
