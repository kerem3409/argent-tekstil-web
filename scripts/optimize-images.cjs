// Run once after image-audit.cjs before; requires local sharp installation.
const fs=require('node:fs');
const sharp=require('../.image-tools/node_modules/sharp');
const before=require('../reports/images-before.json');
(async()=>{
 const mapping=[];
 for(const row of before.rows.filter(r=>r.usedBy.length)){
  const original=fs.readFileSync('../argent-tekstil-image-originals-20261025/'+row.path.replace('assets/',''));
  if(row.path.includes('/logo/')){
   // PNG and alpha remain intact; enough pixels for the 420px intro at 2x.
   const data=await sharp(original).resize({width:1000,withoutEnlargement:true}).png({compressionLevel:9,effort:10}).toBuffer();
   if(data.length<row.bytes){fs.writeFileSync(row.path,data);const m=await sharp(data).metadata();mapping.push({from:row.path,to:row.path,width:m.width,height:m.height,oldBytes:row.bytes,bytes:data.length,variants:[]});}
   continue;
  }
  const hero=/hero/.test(row.path);
  const card=/kategori-|\/products\//.test(row.path);
  const width=Math.min(row.width,hero?1600:card?960:1200);
  const output=row.path.replace(/\.[^.]+$/,'.webp');
  let data=await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:82,effort:6}).toBuffer();
  const skipped=data.length >= row.bytes*(row.format==='webp' ? .9 : 1);
  if(skipped){
   // Avoid generational quality loss for negligible byte savings.
   if(row.format==='webp')fs.writeFileSync(row.path,original);
   if(!hero){mapping.push({from:row.path,to:row.path,width:row.width,height:row.height,oldBytes:row.bytes,bytes:row.bytes,variants:[],skipped:true});continue;}
   data=original;
  }
  fs.writeFileSync(output,data);
  const m=await sharp(data).metadata();
  const variants=[];
  // Only three large hero images need alternative viewport resources.
  if(hero){
   for(const w of [640,960,1280].filter(w=>w<m.width)){
    const p=output.replace('.webp',`-${w}.webp`);
    const buffer=await sharp(original).resize({width:w}).webp({quality:82,effort:6}).toBuffer();
    fs.writeFileSync(p,buffer);variants.push({path:p,width:w,bytes:buffer.length});
   }
  }
  mapping.push({from:row.path,to:output,width:m.width,height:m.height,oldBytes:row.bytes,bytes:data.length,variants,skipped});
 }
 fs.writeFileSync('reports/image-mapping.json',JSON.stringify(mapping,null,2)+'\n');
 console.log('Optimized:',mapping.filter(r=>!r.skipped).length,'Skipped:',mapping.filter(r=>r.skipped).length);
})().catch(e=>{console.error(e);process.exitCode=1});
