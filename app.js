// Embedded source assets allow index.html to work directly from disk.
const ASSETS = {
  "restart": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\"\n     viewBox=\"0 0 40 40\"\n     width=\"160\"\n     height=\"160\"\n     role=\"img\"\n     aria-labelledby=\"title desc\"\n     style=\"color: #8e9394; color: color(display-p3 0.5566406 0.5766602 0.5805664)\">\n  <title id=\"title\">Restart</title>\n  <desc id=\"desc\">Circular restart arrow icon.</desc>\n  <path d=\"M30 14\n           A12 12 0 1 0 31.5 23\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\" />\n  <path d=\"M30 14 V7 M30 14 H23\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\" />\n</svg>\n",
  "hollow-arrow": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\"\n     viewBox=\"-4.66667 -8.5 40 40\"\n     width=\"160\"\n     height=\"160\"\n     preserveAspectRatio=\"xMidYMid meet\"\n     role=\"img\"\n     aria-labelledby=\"title desc\"\n     style=\"color: #8e9394; color: color(display-p3 0.5566406 0.5766602 0.5805664)\">\n  <title id=\"title\">Hollow left-pointing arrow</title>\n  <desc id=\"desc\">Vector arrow extracted from the Keynote HTML export.</desc>\n  <path d=\"M12.56764 16.50365\n           V23\n           L0 11.5\n           L12.56764 0\n           V6.496352\n           H30.66667\n           V16.50365\n           Z\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"butt\"\n        stroke-linejoin=\"miter\" />\n</svg>\n",
  "filled-arrow": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\"\n     viewBox=\"-4.66667 -8.5 40 40\"\n     width=\"160\"\n     height=\"160\"\n     preserveAspectRatio=\"xMidYMid meet\"\n     role=\"img\"\n     aria-labelledby=\"title desc\"\n     style=\"color: #8e9394; color: color(display-p3 0.5566406 0.5766602 0.5805664)\">\n  <title id=\"title\">Filled left-pointing arrow</title>\n  <desc id=\"desc\">Vector arrow extracted from the Keynote HTML export.</desc>\n  <path d=\"M12.56764 16.504\n           V23\n           L0 11.5\n           L12.56764 0\n           V6.497\n           H30.66667\n           V16.504\n           Z\"\n        fill=\"currentColor\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"butt\"\n        stroke-linejoin=\"miter\" />\n</svg>\n",
  "undo": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\"\n     viewBox=\"0 0 40 40\"\n     width=\"160\"\n     height=\"160\"\n     role=\"img\"\n     aria-labelledby=\"title desc\"\n     style=\"color: #8e9394; color: color(display-p3 0.5566406 0.5766602 0.5805664)\">\n  <title id=\"title\">Undo</title>\n  <desc id=\"desc\">Curved undo arrow icon.</desc>\n  <path d=\"M10 12 H21\n           C28 12 32 16 32 22\n           C32 28 27 32 21 32 H16\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\" />\n  <path d=\"M10 12 L16 6 M10 12 L16 18\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\" />\n</svg>\n"
};
const NS = 'http://www.w3.org/2000/svg';
const aliases = {
  up: 'up', arrowup: 'up', w: 'up', '↑': 'up',
  down: 'down', arrowdown: 'down', s: 'down', '↓': 'down',
  left: 'left', arrowleft: 'left', a: 'left', '←': 'left',
  right: 'right', arrowright: 'right', d: 'right', '→': 'right',
  undo: 'undo', z: 'undo', restart: 'restart', r: 'restart'
};
// Style prefixes apply to movement aliases only, e.g. h-up or f-W.
for (const [alias, key] of Object.entries(aliases)) {
  if (key === 'undo' || key === 'restart') continue;
  for (const style of ['filled', 'hollow']) {
    aliases[`${style}-${alias}`] = `${style}-${key}`;
    aliases[`${style[0]}-${alias}`] = `${style}-${key}`;
  }
}
function parseSequence(text) {
  const tokens = text.trim().split(/[\s,]+/u).filter(Boolean);
  const unknown = tokens.filter(token => !Object.hasOwn(aliases, token.toLowerCase()));
  return { tokens, unknown, keys: tokens.map(token => aliases[token.toLowerCase()]) };
}
function svgElement(name, attributes = {}) {
  const element = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}
const templates = Object.fromEntries(Object.entries(ASSETS).map(([key, source]) => {
  const root = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
  return [key, { viewBox: root.getAttribute('viewBox'), paths: [...root.querySelectorAll('path')] }];
}));
function createSequenceSvg(keys, { size, gap, style, color }) {
  const padding = 8;
  const width = padding * 2 + keys.length * size + Math.max(0, keys.length - 1) * gap;
  const height = size + padding * 2;
  const svg = svgElement('svg', { xmlns: NS, width, height, viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `Keypress sequence: ${keys.join(', ')}` });
  const title = svgElement('title');
  title.textContent = `Keypress sequence: ${keys.join(', ')}`;
  svg.append(title);
  const rotations = { left: 0, up: 90, right: 180, down: 270 };
  keys.forEach((token, index) => {
    const styled = token.match(/^(filled|hollow)-(up|down|left|right)$/);
    const key = styled ? styled[2] : token;
    const arrowStyle = styled ? styled[1] : style;
    const isArrow = Object.hasOwn(rotations, key);
    const template = templates[isArrow ? `${arrowStyle}-arrow` : key];
    const icon = svgElement('svg', { x: padding + index * (size + gap), y: padding, width: size, height: size, viewBox: '0 0 40 40' });
    const rotation = svgElement('g', { transform: `rotate(${isArrow ? rotations[key] : 0} 20 20)` });
    // Keep the source viewBox intact inside the centered rotation frame.
    const source = svgElement('svg', { width: 40, height: 40, viewBox: template.viewBox });
    for (const path of template.paths) {
      const copy = path.cloneNode(true);
      for (const attribute of ['fill', 'stroke']) {
        if (copy.getAttribute(attribute) === 'currentColor') copy.setAttribute(attribute, color);
      }
      source.append(copy);
    }
    rotation.append(source);
    icon.append(rotation);
    svg.append(icon);
  });
  return svg;
}
const input = document.querySelector('#sequence');
const preview = document.querySelector('#preview');
const status = document.querySelector('#status');
const download = document.querySelector('#download');
let currentSvg = null;
function render() {
  currentSvg = null;
  download.disabled = true;
  preview.replaceChildren();
  const { tokens, unknown, keys } = parseSequence(input.value);
  document.querySelector('#count').textContent = `${tokens.length} ${tokens.length === 1 ? 'keypress' : 'keypresses'}`;
  status.textContent = '';
  input.setAttribute('aria-invalid', String(unknown.length > 0));
  const empty = message => {
    const text = document.createElement('p');
    text.className = 'empty';
    text.textContent = message;
    preview.append(text);
  };
  if (!tokens.length) return empty('Your sequence will appear here.');
  if (unknown.length) {
    status.textContent = `Unrecognized keys: ${[...new Set(unknown)].join(', ')}. Check the supported keys above.`;
    return empty('Edit the unrecognized keys to preview your sequence.');
  }
  if (tokens.length > 5000) {
    status.textContent = 'Please use at most 5,000 keypresses per sequence.';
    return empty('This sequence is too long.');
  }
  const size = document.querySelector('#size');
  const gap = document.querySelector('#gap');
  if (!size.checkValidity() || !gap.checkValidity() || !size.value || !gap.value) {
    status.textContent = 'Use an icon size of 16–256 px and spacing of 0–128 px (whole numbers).';
    return empty('Adjust the icon size or spacing.');
  }
  currentSvg = createSequenceSvg(keys, { size: Number(size.value), gap: Number(gap.value), style: document.querySelector('#style').value, color: document.querySelector('#color').value });
  preview.append(currentSvg);
  download.disabled = false;
}
for (const element of document.querySelectorAll('textarea, select, input')) element.addEventListener('input', render);
document.querySelector('#example').addEventListener('click', () => {
  input.value = 'f-up, h-right, right, h-down, left, undo, restart';
  render();
});
download.addEventListener('click', () => {
  if (!currentSvg) return;
  const data = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(currentSvg);
  const url = URL.createObjectURL(new Blob([data], { type: 'image/svg+xml;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'keypress-sequence.svg';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render();
