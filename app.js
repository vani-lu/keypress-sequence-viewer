// Embedded source assets allow index.html to work directly from disk.
const ASSETS = {
  "restart": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\"\n     viewBox=\"0 0 40 40\"\n     width=\"160\"\n     height=\"160\"\n     role=\"img\"\n     aria-labelledby=\"title desc\"\n     style=\"color: #8e9394; color: color(display-p3 0.5566406 0.5766602 0.5805664)\">\n  <title id=\"title\">Restart</title>\n  <desc id=\"desc\">Circular restart arrow icon.</desc>\n  <path d=\"M30 14\n           A12 12 0 1 0 31.5 23\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\" />\n  <path d=\"M30 14 V7 M30 14 H23\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\" />\n</svg>\n",
  "hollow-arrow": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\"\n     viewBox=\"-4.66667 -8.5 40 40\"\n     width=\"160\"\n     height=\"160\"\n     preserveAspectRatio=\"xMidYMid meet\"\n     role=\"img\"\n     aria-labelledby=\"title desc\"\n     style=\"color: #8e9394; color: color(display-p3 0.5566406 0.5766602 0.5805664)\">\n  <title id=\"title\">Hollow left-pointing arrow</title>\n  <desc id=\"desc\">Vector arrow extracted from the Keynote HTML export.</desc>\n  <path d=\"M12.56764 16.50365\n           V23\n           L0 11.5\n           L12.56764 0\n           V6.496352\n           H30.66667\n           V16.50365\n           Z\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"butt\"\n        stroke-linejoin=\"miter\" />\n</svg>\n",
  "filled-arrow": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\"\n     viewBox=\"-4.66667 -8.5 40 40\"\n     width=\"160\"\n     height=\"160\"\n     preserveAspectRatio=\"xMidYMid meet\"\n     role=\"img\"\n     aria-labelledby=\"title desc\"\n     style=\"color: #8e9394; color: color(display-p3 0.5566406 0.5766602 0.5805664)\">\n  <title id=\"title\">Filled left-pointing arrow</title>\n  <desc id=\"desc\">Vector arrow extracted from the Keynote HTML export.</desc>\n  <path d=\"M12.56764 16.504\n           V23\n           L0 11.5\n           L12.56764 0\n           V6.497\n           H30.66667\n           V16.504\n           Z\"\n        fill=\"currentColor\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"butt\"\n        stroke-linejoin=\"miter\" />\n</svg>\n",
  "undo": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\"\n     viewBox=\"0 0 40 40\"\n     width=\"160\"\n     height=\"160\"\n     role=\"img\"\n     aria-labelledby=\"title desc\"\n     style=\"color: #8e9394; color: color(display-p3 0.5566406 0.5766602 0.5805664)\">\n  <title id=\"title\">Undo</title>\n  <desc id=\"desc\">Curved undo arrow icon.</desc>\n  <path d=\"M10 12 H21\n           C28 12 32 16 32 22\n           C32 28 27 32 21 32 H16\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\" />\n  <path d=\"M10 12 L16 6 M10 12 L16 18\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\" />\n</svg>\n"
};
const SEQUENCE_EXAMPLE = {
  "operations": "h-right, h-left, h-up, f-up, f-up, f-up, f-up, f-up, h-left, h-up, f-right, f-right, f-right, f-right, f-right, f-right, f-right, f-right, restart, h-up, f-up, f-up, f-up, f-up, f-up, h-left, h-left, h-left, h-left, h-left, h-up, f-right, f-right, f-right, f-right, f-right, f-right, f-right, f-right, f-right, f-right, f-right, f-right, f-right, h-down, h-down, h-down, h-down, h-right, h-right, h-right, f-right",
  "l0": "1-4, 5, 6, 7, 8, 9-11, 12, 13, 14, 15, 16, 17, 18, 20-21, 22, 23, 24, 25, 26-32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45-52",
  "l2": "1-18, 20-40, 41-44, 45-52"
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
function parseRanges(text, keys, level) {
  const assignments = Array(keys.length).fill(null);
  const normalized = text.trim().replace(/[–—]/g, '-').replace(/\s*-\s*/g, '-');
  const ranges = normalized.split(/[\s,]+/).filter(Boolean);
  for (let i = 0; i < ranges.length; i++) {
    const match = ranges[i].match(/^(\d+)(?:-(\d+))?$/);
    if (!match) return { error: `${level}: invalid range "${ranges[i]}". Use 1-4, 5, 6-8.` };
    const first = Number(match[1]), last = Number(match[2] ?? match[1]);
    if (first < 1 || last < first || last > keys.length) {
      return { error: `${level}: range ${ranges[i]} must be within 1–${keys.length}, with its start no greater than its end.` };
    }
    for (let index = first - 1; index < last; index++) {
      if (keys[index] === 'restart') return { error: `${level}: operation ${index + 1} is Restart. Leave it out and split the range around it.` };
      if (assignments[index] !== null) return { error: `${level}: overlapping ranges at operation ${index + 1}.` };
      assignments[index] = String(i + 1);
    }
  }
  return { assignments };
}
function parseSegmentRanges(keys, l0Text, l2Text) {
  const l0 = parseRanges(l0Text, keys, 'Lower abstraction');
  const l2 = parseRanges(l2Text, keys, 'Higher abstraction');
  if (l0.error || l2.error) return { error: l0.error || l2.error };
  return { segments: keys.map((_, index) => ({ l0: l0.assignments[index], l2: l2.assignments[index] })) };
}
function segmentRuns(segments, level) {
  const runs = [];
  for (let start = 0; start < segments.length;) {
    const id = segments[start][level];
    if (id == null) { start++; continue; }
    let end = start + 1;
    while (end < segments.length && segments[end][level] === id) end++;
    runs.push({ start, end, id });
    start = end;
  }
  return runs;
}
function hierarchyError(segments) {
  if (!segments.some(segment => segment.l0 != null) || !segments.some(segment => segment.l2 != null)) return null;
  for (const child of segmentRuns(segments, 'l0')) {
    const parentIds = new Set(segments.slice(child.start, child.end).map(segment => segment.l2));
    if (parentIds.size !== 1) {
      return `Lower abstraction: segment ${child.start + 1}–${child.end} must fit entirely inside one higher abstraction segment to show hierarchy connectors. Adjust the ranges or turn connectors off.`;
    }
  }
  return null;
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
function createSequenceSvg(keys, { size, gap, style, color, showRuler = false, segments = [], segmentGap = 8, layerGap = 24, cornerRadius = 12, lowerHeight = 46, higherHeight = 46, lowerColor = '#2F95CA', higherColor = '#885BB5', showConnectors = false, connectorExtraGap = 16 }) {
  const padding = 8;
  const hasSegments = segments.some(segment => segment.l0 !== null || segment.l2 !== null);
  const bandStroke = 3.75;
  const bandGap = layerGap + (showConnectors ? connectorExtraGap : 0);
  const operationOffset = hasSegments ? higherHeight + lowerHeight + 2 * bandGap : 0;
  const width = padding * 2 + keys.length * size + Math.max(0, keys.length - 1) * gap;
  const height = operationOffset + size + padding * 2 + (showRuler ? 58 : 0);
  // Keep large end labels inside the export without moving icons or ticks.
  const labelDigits = String(Math.floor(keys.length / 5) * 5).length;
  const labelMargin = showRuler && keys.length >= 5 ? Math.max(0, Math.ceil(labelDigits * 28 * 0.6 / 2 - padding - size / 2)) : 0;
  const exportWidth = width + 2 * labelMargin;
  const svg = svgElement('svg', { xmlns: NS, width: exportWidth, height, viewBox: `${-labelMargin} 0 ${exportWidth} ${height}`, role: 'img', 'aria-label': `Keypress sequence: ${keys.join(', ')}` });
  const title = svgElement('title');
  title.textContent = `Keypress sequence: ${keys.join(', ')}`;
  svg.append(title);
  if (hasSegments) {
    if (showConnectors && bandGap > bandStroke && !hierarchyError(segments)) {
      const connectorStroke = 2.5;
      const connectors = svgElement('g', { 'aria-label': 'Abstraction hierarchy connectors', fill: 'none', stroke: '#a6a6a6', 'stroke-opacity': 1, 'stroke-width': connectorStroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      const center = run => {
        const left = run.start === 0 ? padding : padding + run.start * (size + gap) - gap / 2;
        const right = run.end === keys.length ? width - padding : padding + run.end * (size + gap) - gap / 2;
        return (left + right) / 2;
      };
      const upperBottom = padding + higherHeight;
      const lowerTop = upperBottom + bandGap;
      const branchY = (upperBottom + lowerTop) / 2;
      const children = segmentRuns(segments, 'l0');
      for (const parent of segmentRuns(segments, 'l2')) {
        const members = children.filter(child => child.start >= parent.start && child.end <= parent.end);
        if (!members.length) continue;
        const parentX = center(parent);
        const childXs = members.map(center);
        const left = Math.min(parentX, ...childXs), right = Math.max(parentX, ...childXs);
        const path = `M ${parentX} ${upperBottom} V ${branchY} M ${left} ${branchY} H ${right} ` + childXs.map(x => `M ${x} ${branchY} V ${lowerTop}`).join(' ');
        connectors.append(svgElement('path', { d: path, 'data-connection': 'higher-lower' }));
      }
      const lowerBottom = lowerTop + lowerHeight;
      const iconTop = padding + operationOffset;
      const operationBranchY = (lowerBottom + iconTop) / 2;
      // Leave 2 visible pixels above the Up tip, including the round cap extent.
      const operationEndpointY = iconTop + 2.444697 * size / 40 - 2 - connectorStroke / 2;
      for (const parent of children) {
        const operations = [];
        for (let index = parent.start; index < parent.end; index++) {
          const key = keys[index].replace(/^(filled|hollow)-/, '');
          if (key === 'restart') continue;
          operations.push({
            x: padding + index * (size + gap) + size / 2,
            y: operationEndpointY
          });
        }
        if (!operations.length) continue;
        const parentX = center(parent);
        const left = Math.min(parentX, ...operations.map(operation => operation.x));
        const right = Math.max(parentX, ...operations.map(operation => operation.x));
        const path = `M ${parentX} ${lowerBottom} V ${operationBranchY} M ${left} ${operationBranchY} H ${right} ` + operations.map(operation => `M ${operation.x} ${operationBranchY} V ${operation.y}`).join(' ');
        connectors.append(svgElement('path', { d: path, 'data-connection': 'lower-operation' }));
      }
      if (connectors.children.length) svg.append(connectors);
    }
    // Boundaries lie halfway between operation centers; Restart occupies an empty slot.
    for (const [level, y, bandColor, bandHeight] of [
      ['l2', padding, higherColor, higherHeight],
      ['l0', padding + higherHeight + bandGap, lowerColor, lowerHeight]
    ]) {
      const lane = svgElement('g', { 'aria-label': `${level === 'l0' ? 'Lower abstraction' : 'Higher abstraction'} segments` });
      let index = 0;
      while (index < keys.length) {
        const id = segments[index]?.[level];
        if (id == null) { index++; continue; }
        let end = index + 1;
        while (end < keys.length && segments[end]?.[level] === id) end++;
        const left = index === 0 ? padding : padding + index * (size + gap) - gap / 2;
        const right = end === keys.length ? width - padding : padding + end * (size + gap) - gap / 2;
        const inset = segmentGap / 2;
        lane.append(svgElement('rect', {
          x: left + inset, y, width: right - left - inset * 2, height: bandHeight,
          rx: Math.min(cornerRadius, (right - left - inset * 2) / 2, bandHeight / 2),
          fill: bandColor, 'fill-opacity': 0.4,
          stroke: bandColor, 'stroke-opacity': 1, 'stroke-width': bandStroke
        }));
        index = end;
      }
      svg.append(lane);
    }
  }
  const rotations = { left: 0, up: 90, right: 180, down: 270 };
  keys.forEach((token, index) => {
    const styled = token.match(/^(filled|hollow)-(up|down|left|right)$/);
    const key = styled ? styled[2] : token;
    const arrowStyle = styled ? styled[1] : style;
    const isArrow = Object.hasOwn(rotations, key);
    const template = templates[isArrow ? `${arrowStyle}-arrow` : key];
    const icon = svgElement('svg', { x: padding + index * (size + gap), y: padding + operationOffset, width: size, height: size, viewBox: '0 0 40 40' });
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
  if (showRuler && keys.length) {
    const ruler = svgElement('g', { 'aria-label': 'Operation index ruler, starting at 1' });
    const centerX = index => padding + index * (size + gap) + size / 2;
    const baselineY = padding + operationOffset + size + 7;
    ruler.append(svgElement('line', {
      x1: centerX(0), x2: centerX(keys.length - 1),
      y1: baselineY, y2: baselineY, stroke: '#000000', 'stroke-width': 2
    }));
    keys.forEach((_, index) => {
      const operationIndex = index + 1;
      const major = operationIndex % 5 === 0;
      const x = centerX(index);
      ruler.append(svgElement('line', {
        x1: x, x2: x, y1: baselineY, y2: baselineY + (major ? 12 : 8),
        stroke: '#000000', 'stroke-width': 2
      }));
      if (major) {
        const label = svgElement('text', {
          x, y: baselineY + 44, fill: '#000000', 'text-anchor': 'middle',
          'font-family': 'Arial, sans-serif', 'font-size': 28
        });
        label.textContent = operationIndex;
        ruler.append(label);
      }
    });
    svg.append(ruler);
  }
  return svg;
}
const input = document.querySelector('#sequence');
const l0Input = document.querySelector('#l0-ranges');
const l2Input = document.querySelector('#l2-ranges');
const preview = document.querySelector('#preview');
const status = document.querySelector('#status');
const download = document.querySelector('#download');
let currentSvg = null;
function render() {
  currentSvg = null;
  download.disabled = true;
  preview.replaceChildren();
  const { tokens, unknown, keys } = parseSequence(input.value);
  const parsed = parseSegmentRanges(keys, l0Input.value, l2Input.value);
  const segments = parsed.segments;
  const showConnectors = document.querySelector('#connectors').checked;
  const connectorExtraGap = document.querySelector('#connector-extra-gap');
  document.querySelector('#connector-gap-control').hidden = !showConnectors;
  connectorExtraGap.disabled = !showConnectors;
  const error = parsed.error || (showConnectors ? hierarchyError(segments) : null);
  document.querySelector('#count').textContent = `${tokens.length} ${tokens.length === 1 ? 'keypress' : 'keypresses'}`;
  status.textContent = '';
  input.setAttribute('aria-invalid', String(unknown.length > 0));
  l0Input.setAttribute('aria-invalid', String(Boolean(error?.startsWith('Lower abstraction:'))));
  l2Input.setAttribute('aria-invalid', String(Boolean(error?.startsWith('Higher abstraction:'))));
  const empty = message => {
    const text = document.createElement('p');
    text.className = 'empty';
    text.textContent = message;
    preview.append(text);
  };
  if (error) {
    status.textContent = error;
    return empty('Edit the segment ranges to preview your sequence.');
  }
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
  const segmentGap = document.querySelector('#segment-gap');
  const layerGap = document.querySelector('#layer-gap');
  const cornerRadius = document.querySelector('#corner-radius');
  const lowerHeight = document.querySelector('#lower-height');
  const higherHeight = document.querySelector('#higher-height');
  if (!size.checkValidity() || !gap.checkValidity() || !size.value || !gap.value) {
    status.textContent = 'Use an icon size of 16–256 px and spacing of 0–128 px (whole numbers).';
    return empty('Adjust the icon size or spacing.');
  }
  if (!segmentGap.value || !segmentGap.checkValidity() || Number(segmentGap.value) > Number(size.value) - 2) {
    status.textContent = `Use a segment gap of 0–${Math.min(128, Number(size.value) - 2)} px (whole numbers).`;
    return empty('Adjust the segment gap.');
  }
  if (!layerGap.value || !layerGap.checkValidity()) {
    status.textContent = 'Use a layer gap of 0–128 px (whole numbers).';
    return empty('Adjust the layer gap.');
  }
  if (!cornerRadius.value || !cornerRadius.checkValidity()) {
    status.textContent = 'Use a corner radius of 0–128 px (whole numbers).';
    return empty('Adjust the corner radius.');
  }
  if (!lowerHeight.value || !higherHeight.value || !lowerHeight.checkValidity() || !higherHeight.checkValidity()) {
    status.textContent = 'Use lower and higher abstraction heights of 8–256 px (whole numbers).';
    return empty('Adjust the abstraction heights.');
  }
  if (showConnectors && (!connectorExtraGap.value || !connectorExtraGap.checkValidity())) {
    status.textContent = 'Use a connector extra gap of 0–128 px (whole numbers).';
    return empty('Adjust the connector extra gap.');
  }
  currentSvg = createSequenceSvg(keys, { size: Number(size.value), gap: Number(gap.value), style: document.querySelector('#style').value, color: document.querySelector('#color').value, showRuler: document.querySelector('#ruler').checked, segments, segmentGap: Number(segmentGap.value), layerGap: Number(layerGap.value), cornerRadius: Number(cornerRadius.value), lowerHeight: Number(lowerHeight.value), higherHeight: Number(higherHeight.value), lowerColor: document.querySelector('#lower-color').value, higherColor: document.querySelector('#higher-color').value, showConnectors, connectorExtraGap: showConnectors ? Number(connectorExtraGap.value) : 0 });
  preview.append(currentSvg);
  download.disabled = false;
}
for (const element of document.querySelectorAll('textarea, select, input')) element.addEventListener('input', render);
function loadExample() {
  input.value = SEQUENCE_EXAMPLE.operations;
  l0Input.value = SEQUENCE_EXAMPLE.l0;
  l2Input.value = SEQUENCE_EXAMPLE.l2;
  render();
}
document.querySelector('#example').addEventListener('click', loadExample);
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
loadExample();
