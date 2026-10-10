const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element {
  constructor(name,attrs={}){this.name=name;this.attrs=attrs;this.children=[];}
  setAttribute(k,v){this.attrs[k]=String(v);}
  getAttribute(k){return this.attrs[k];}
  append(...items){this.children.push(...items);}
  cloneNode(){return new Element(this.name,{...this.attrs});}
}
const attrs=text=>Object.fromEntries([...text.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
class DOMParser {parseFromString(source){const root=new Element('svg',attrs(source.match(/<svg\s[\s\S]*?>/)[0]));root.querySelectorAll=()=>[...source.matchAll(/<path\s[\s\S]*?\/>/g)].map(m=>new Element('path',attrs(m[0])));return {documentElement:root};}}
const context=vm.createContext({DOMParser,document:{createElementNS:(_,name)=>new Element(name)}});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname, '../app.js'),'utf8').split("const input = document.querySelector")[0]+'\nglobalThis.api={createSequenceSvg,parseSequence,parseRanges,parseSegmentRanges,SEQUENCE_EXAMPLE};',context);
const {createSequenceSvg,parseSequence,parseRanges,parseSegmentRanges,SEQUENCE_EXAMPLE}=context.api;
const keys = parseSequence('h-right f-up restart h-left f-right h-down').keys;
const small = parseSegmentRanges(keys, '1-2, 4, 5-6', '1-2, 4-6');
assert.equal(small.error, undefined);
assert.equal(small.segments.map(s=>s.l0??'-').join(','),'1,1,-,2,3,3');
assert.equal(small.segments.map(s=>s.l2??'-').join(','),'1,1,-,2,2,2');
for (const bad of ['0', '7', '4-2', '1-2,2', '1.5', '1-x', '1-3', '3']) assert.ok(parseRanges(bad, keys, 'L0').error, bad);
assert.equal(parseRanges('1 – 2, 4\n5-6',keys,'L0').assignments.join(','),'1,1,,2,3,3');
assert.equal(parseSegmentRanges(keys,'','').segments.every(s=>s.l0===null&&s.l2===null),true);
const operations=parseSequence(SEQUENCE_EXAMPLE.operations).keys;
const {segments,error}=parseSegmentRanges(operations,SEQUENCE_EXAMPLE.l0,SEQUENCE_EXAMPLE.l2);
assert.equal(error,undefined);
assert.equal(operations.length,52);
assert.equal(operations[18],'restart');
assert.equal(segments[18].l0,null);
assert.equal(segments[18].l2,null);
function lengths(level){
 const counts=new Map();
 for(const segment of segments) if(segment[level]!==null) counts.set(segment[level],(counts.get(segment[level])??0)+1);
 return [...counts.values()];
}
assert.deepEqual(lengths('l0'),[4,1,1,1,1,3,...Array(7).fill(1),2,...Array(4).fill(1),7,...Array(12).fill(1),8]);
assert.deepEqual(lengths('l2'),[18,6,19,8]);
for (const size of [16,48,256]) for (const gap of [0,12,128]) {
 const options={size,gap,style:'filled',color:'#555555',showRuler:true};
 const plain=createSequenceSvg(operations,options);
 const svg=createSequenceSvg(operations,{...options,segments});
 assert.ok(Math.abs(Number(svg.attrs.height)-Number(plain.attrs.height)-2 * (size * (46 / 48) + 24))<1e-9);
 const bands=svg.children.filter(c=>c.name==='g'&&c.children[0]?.name==='rect');
 assert.equal(bands[0].children.length,4);
 assert.equal(bands[1].children.length,32);
 const icons=svg.children.filter(c=>c.name==='svg');
 assert.ok(icons.every(icon=>Number(icon.attrs.y)===8+2*(size*(46 / 48)+24)));
 const restartX=Number(icons[18].attrs.x)+size/2;
 for(const [i,color] of ['#885BB5','#2F95CA'].entries()) for(const rect of bands[i].children){
  assert.equal(rect.attrs.fill,color);
  assert.equal(rect.attrs['fill-opacity'],'0.4');
  assert.equal(rect.attrs.height,String(size*(46 / 48)));
  assert.equal(rect.attrs['stroke-width'],'3.75');
  assert.equal(rect.attrs['stroke-opacity'],'1');
  assert.equal(Number(rect.attrs.rx),Math.min(12,Number(rect.attrs.width)/2,Number(rect.attrs.height)/2));
  assert.ok(restartX<Number(rect.attrs.x)||restartX>Number(rect.attrs.x)+Number(rect.attrs.width));
 }
 const ticks=svg.children.at(-1).children.filter(c=>c.name==='line').slice(1);
 assert.ok(svg.children.at(-1).children.filter(c=>c.name==='line').every(line=>line.attrs['stroke-width']==='2'));
 assert.ok(svg.children.at(-1).children.filter(c=>c.name==='text').every(label=>label.attrs['font-size']==='28'));
 assert.equal(Number(ticks[0].attrs.y1),8+2*(size*(46 / 48)+24)+size+7);
 ticks.forEach((tick,i)=>assert.equal(Number(tick.attrs.x1),Number(icons[i].attrs.x)+size/2));
 assert.equal(svg.children.at(-1).children.filter(c=>c.name==='text').length,10);
}
const adjacent=parseSegmentRanges(parseSequence('up up').keys,'1,2','1-2');
const adjacentSvg=createSequenceSvg(['up','up'],{size:48,gap:12,style:'filled',color:'#555',segments:adjacent.segments});
assert.equal(adjacentSvg.children[2].children.length,2);
console.log('Passed: range validation, gaps, adjacent segments, original 52-operation hierarchy, colors, Restart gap, and ruler alignment at size/spacing extremes.');
// Exercise initialization and live field/button wiring without requiring a browser.
Element.prototype.addEventListener=function(type,callback){(this.events??={})[type]=callback;};
Element.prototype.replaceChildren=function(...children){this.children=children;};
Element.prototype.checkValidity=function(){return true;};
const elements=Object.fromEntries(['sequence','l0-ranges','l2-ranges','preview','status','download','count','size','gap','segment-gap','layer-gap','corner-radius','style','color','lower-color','higher-color','ruler','example'].map(id=>[id,new Element('div')]));
for(const element of Object.values(elements))element.value='';
Object.assign(elements.size,{value:'48'});
Object.assign(elements.gap,{value:'12'});
Object.assign(elements['segment-gap'],{value:'8'});
Object.assign(elements['layer-gap'],{value:'24'});
Object.assign(elements['corner-radius'],{value:'12'});
Object.assign(elements.style,{value:'filled'});
Object.assign(elements.color,{value:'#555555'});
Object.assign(elements['lower-color'],{value:'#2F95CA'});
Object.assign(elements['higher-color'],{value:'#885BB5'});
Object.assign(elements.ruler,{checked:true});
const uiContext=vm.createContext({DOMParser,document:{
 createElementNS:(_,name)=>new Element(name),createElement:name=>new Element(name),
 querySelector:selector=>elements[selector.slice(1)],
 querySelectorAll:()=>['sequence','l0-ranges','l2-ranges','size','gap','segment-gap','layer-gap','corner-radius','style','color','lower-color','higher-color','ruler'].map(id=>elements[id])
}});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8'),uiContext);
assert.equal(elements.sequence.value,SEQUENCE_EXAMPLE.operations);
assert.equal(elements['l0-ranges'].value,SEQUENCE_EXAMPLE.l0);
assert.equal(elements['l2-ranges'].value,SEQUENCE_EXAMPLE.l2);
assert.equal(elements.download.disabled,false);
elements['l0-ranges'].value='1-19';
elements['l0-ranges'].events.input();
assert.equal(elements.download.disabled,true);
assert.ok(elements.status.textContent.includes('Restart'));
assert.equal(elements['l0-ranges'].attrs['aria-invalid'],'true');
elements.example.events.click();
assert.equal(elements.download.disabled,false);
assert.equal(elements['l0-ranges'].value,SEQUENCE_EXAMPLE.l0);
elements['l0-ranges'].value='';elements['l2-ranges'].value='';
elements['l2-ranges'].events.input();
assert.equal(elements.download.disabled,false);
assert.equal(elements.preview.children[0].children.filter(c=>c.name==='g'&&c.children[0]?.name==='rect').length,0);
console.log('Passed: three-field initialization, live validation, example reset, and optional empty ranges.');
for(const segmentGap of [0,8,20]){
 const svg=createSequenceSvg(['up','up'],{size:48,gap:12,style:'filled',color:'#555',segments:adjacent.segments,segmentGap});
 const rectangles=svg.children[2].children;
 assert.equal(Number(rectangles[1].attrs.x)-Number(rectangles[0].attrs.x)-Number(rectangles[0].attrs.width),segmentGap);
 assert.ok(rectangles.every(rect=>Number(rect.attrs.width)>0));
 const icons=svg.children.filter(child=>child.name==='svg');
 assert.equal(icons[0].attrs.x,'8');
 assert.equal(icons[1].attrs.x,'68');
}
elements['segment-gap'].value='48';elements['segment-gap'].events.input();
assert.equal(elements.download.disabled,true);
assert.ok(elements.status.textContent.includes('segment gap'));
elements['segment-gap'].value='12';elements['segment-gap'].events.input();
assert.equal(elements.download.disabled,false);
console.log('Passed: adjustable segment gaps, fixed operation positions, and excessive-gap validation.');
elements.example.events.click();
elements['lower-color'].value='#dd6600';
elements['higher-color'].value='#228844';
elements['lower-color'].events.input();
const coloredBands=elements.preview.children[0].children.filter(c=>c.name==='g'&&c.children[0]?.name==='rect');
for(const [i,color] of ['#228844','#dd6600'].entries())for(const rect of coloredBands[i].children){
 assert.equal(rect.attrs.fill,color);
 assert.equal(rect.attrs.stroke,color);
 assert.equal(rect.attrs['fill-opacity'],'0.4');
}
assert.equal(elements.download.disabled,false);
console.log('Passed: independent abstraction color controls update SVG fill and outline while retaining opacity.');
for(const layerGap of [0,12,24,64,128]){
 const svg=createSequenceSvg(['up','up'],{size:48,gap:12,style:'filled',color:'#555',showRuler:true,segments:adjacent.segments,layerGap});
 const higher=svg.children[1].children[0],lower=svg.children[2].children[0];
 const icon=svg.children.find(c=>c.name==='svg');
 assert.equal(Number(lower.attrs.y)-Number(higher.attrs.y)-Number(higher.attrs.height),layerGap);
 assert.equal(Number(icon.attrs.y)-Number(lower.attrs.y)-Number(lower.attrs.height),layerGap);
 assert.equal(Number(svg.children.at(-1).children[0].attrs.y1)-Number(icon.attrs.y),55);
}
elements['layer-gap'].value='36';elements['layer-gap'].events.input();
assert.equal(elements.download.disabled,false);
const resized=elements.preview.children[0];
assert.equal(Number(resized.children.find(c=>c.name==='svg').attrs.y),8+2*(46+36));
elements['layer-gap'].value='';elements['layer-gap'].events.input();
assert.equal(elements.download.disabled,true);
console.log('Passed: editable vertical layer gaps, live updates, and ruler-relative positioning.');
for(const cornerRadius of [0,4,12,24,128]){
 const svg=createSequenceSvg(['up','up'],{size:48,gap:12,style:'filled',color:'#555',segments:adjacent.segments,cornerRadius});
 for(const lane of svg.children.slice(1,3)) for(const rect of lane.children){
  assert.equal(Number(rect.attrs.rx),Math.min(cornerRadius,Number(rect.attrs.width)/2,Number(rect.attrs.height)/2));
 }
}
elements['layer-gap'].value='24';
elements['corner-radius'].value='8';elements['corner-radius'].events.input();
assert.equal(elements.download.disabled,false);
const rounded=elements.preview.children[0].children.filter(c=>c.name==='g'&&c.children[0]?.name==='rect');
assert.ok(rounded.every(lane=>lane.children.every(rect=>Number(rect.attrs.rx)===8)));
elements['corner-radius'].value='';elements['corner-radius'].events.input();
assert.equal(elements.download.disabled,true);
assert.ok(elements.status.textContent.includes('corner radius'));
console.log('Passed: editable corner radius, zero/saturated radius bounds, and live control validation.');
