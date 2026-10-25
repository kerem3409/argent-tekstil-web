const fs=require('node:fs');
const {sources}=require('./image-audit.cjs');
const mapping=require('../reports/image-mapping.json');
const before=require('../reports/images-before.json');
const baseline=require('../.image-qa/browser-before.json');
const sharp=require('../.image-tools/node_modules/sharp');
(async()=>{
 const metadata={};
 for(const r of before.rows){const m=mapping.find(m=>m.from===r.path);metadata[m?.to||r.path]=await sharp(m?.to||r.path).metadata();}
 for(const file of sources){
  let source=fs.readFileSync(file,'utf8');
  for(const r of mapping.filter(r=>r.from!==r.to))source=source.split(r.from).join(r.to);
  if(file.endsWith('.html')){
   let firstProduct=true;
   const occurrences={};
   source=source.replace(/<img\b[^>]*>/g,tag=>{
    const src=tag.match(/\bsrc="([^"]+)"/)?.[1],m=metadata[src];
    if(!m)throw Error(`Unknown image ${file}: ${src}`);
    let t=tag.replace(/\s(?:width|height|loading|decoding|fetchpriority|srcset|sizes)="[^"]*"/g,'');
    const original=mapping.find(r=>r.to===src)?.from||src;
    const occurrence=occurrences[original]||0;
    occurrences[original]=occurrence+1;
    const inViewport=baseline.filter(r=>r.file===file).some(r=>{
     const image=r.initial.images.filter(i=>i.src===original)[occurrence];
     return image && image.top<r.viewport.height;
    });
    const logo=src.includes('/logo/');
    const lcp=baseline.some(r=>r.file===file && r.initial.lcp.at(-1)?.source.endsWith('/'+original));
    // The first product main image shares its URL with a thumbnail; prioritize only the main.
    const main=/data-main-image/.test(tag);
    const high=lcp && (!src.includes('/products/') || (main&&firstProduct));
    if(main)firstProduct=false;
    t=t.replace(/>$/,` width="${m.width}" height="${m.height}"${high?' fetchpriority="high"':(!logo&&!inViewport?' loading="lazy"':'')}${!logo?' decoding="async"':''}>`);
    const r=mapping.find(r=>r.to===src);
    if(r?.variants.length){
     const sizes=file==='index.html'?'(max-width: 520px) calc(100vw - 32px), (max-width: 768px) calc(100vw - 48px), (max-width: 1288px) 55vw, 700px':file==='uretim.html'?'(max-width: 768px) calc(100vw - 48px), (max-width: 1288px) 50vw, 650px':'(max-width: 768px) calc(100vw - 48px), (max-width: 1288px) 50vw, 650px';
     t=t.replace(/>$/,` srcset="${[...r.variants.map(v=>`${v.path} ${v.width}w`),`${r.to} ${r.width}w`].join(', ')}" sizes="${sizes}">`);
    }
    return t;
   });
   // Version the changed CSS so returning visitors get the intrinsic-size safety rule.
   source=source.replace(/css\/style\.css(?:\?[^"']*)?/g,'css/style.css?v=20261025-1');
  }
  fs.writeFileSync(file,source);
 }
 // Width/height attributes must not override existing fluid image heights.
 let css=fs.readFileSync('css/style.css','utf8');
 css=css.replace('img { display: block; width: 100%; }','img { display: block; width: 100%; height: auto; }');
 fs.writeFileSync('css/style.css',css);
})().catch(e=>{console.error(e);process.exitCode=1});
