const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('../.image-tools/node_modules/sharp');
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
const sources = [...fs.readdirSync('.').filter(f=>f.endsWith('.html')), ...walk('css'), ...walk('js')].filter(f=>/\.(html|css|js)$/.test(f));
async function audit() {
 const rows=[];
 for(const file of walk('assets/images').filter(f=>/\.(jpe?g|png|webp|svg|avif)$/i.test(f))) {
  const data=fs.readFileSync(file), m=await sharp(data).metadata();
  const usedBy=sources.filter(s=> {
   const source=fs.readFileSync(s,'utf8');
   return source.includes(file) || source.includes('../'+file);
  });
  rows.push({path:file,format:m.format,bytes:data.length,width:m.width,height:m.height,alpha:m.hasAlpha,sha256:crypto.createHash('sha256').update(data).digest('hex'),usedBy});
 }
 return {created:new Date().toISOString(),totalBytes:rows.reduce((s,r)=>s+r.bytes,0),referencedBytes:rows.filter(r=>r.usedBy.length).reduce((s,r)=>s+r.bytes,0),rows};
}
module.exports={audit,walk,sources};
if(require.main===module) audit().then(result=>{
 fs.mkdirSync('reports',{recursive:true});
 const label=process.argv[2]||'before';
 fs.writeFileSync(`reports/images-${label}.json`,JSON.stringify(result,null,2)+'\n');
 fs.writeFileSync(`reports/images-${label}.csv`,'path,format,bytes,width,height,usedBy\n'+result.rows.map(r=>[r.path,r.format,r.bytes,r.width,r.height,r.usedBy.join(';')].map(v=>JSON.stringify(v)).join(',')).join('\n')+'\n');
 console.log(JSON.stringify({...result,rows:undefined,count:result.rows.length,unused:result.rows.filter(r=>!r.usedBy.length).length,largest:result.rows.toSorted((a,b)=>b.bytes-a.bytes).slice(0,15)},null,2));
});
