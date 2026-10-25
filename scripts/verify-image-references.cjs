const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const sharp=require('../.image-tools/node_modules/sharp');
const {sources}=require('./image-audit.cjs');
const mapping=require('../reports/image-mapping.json');
(async()=>{
 let checks=0,images=0;
 const check=(url,source)=>{
  if(/^(?:https?:|data:|#|mailto:|tel:)/.test(url))return;
  const file=path.resolve(path.dirname(source),decodeURIComponent(url.split(/[?#]/)[0]));
  assert(fs.existsSync(file),`${source}: missing ${url}`);checks++;
 };
 for(const source of sources){
  const text=fs.readFileSync(source,'utf8');
  for(const m of text.matchAll(/\b(?:src|data-image-src|href)="([^"]+)"/g)){
   if(!m[1].startsWith('http') && !m[1].startsWith('#'))check(m[1],source);
  }
  for(const m of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g))check(m[1],source);
  for(const m of text.matchAll(/\bsrcset="([^"]+)"/g))for(const item of m[1].split(',')){
   const [url,width]=item.trim().split(/\s+/);check(url,source);
   const meta=await sharp(path.resolve(path.dirname(source),url)).metadata();
   assert.equal(meta.width,parseInt(width),`srcset width: ${url}`);
  }
  let high=0;
  for(const m of text.matchAll(/<img\b[^>]*>/g)){
   images++;const attrs=Object.fromEntries([...m[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(x=>[x[1],x[2]]));
   const meta=await sharp(path.resolve(path.dirname(source),attrs.src)).metadata();
   assert.equal(+attrs.width,meta.width,attrs.src+' width');assert.equal(+attrs.height,meta.height,attrs.src+' height');
   if(attrs.fetchpriority==='high'){high++;assert.notEqual(attrs.loading,'lazy');}
   if(attrs.loading==='lazy')assert.equal(attrs.decoding,'async');
  }
  assert(high<=1,source+' has multiple high-priority images');
 }
 for(const m of mapping.filter(m=>m.from!==m.to))assert(m.bytes<m.oldBytes,m.to+' is not smaller');
 console.log(`${checks} local references and ${images} intrinsic image dimensions verified; srcsets valid; at most one high priority per page; no lazy LCP.`);
})().catch(e=>{console.error(e);process.exitCode=1});
