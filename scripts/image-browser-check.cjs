const fs=require('node:fs'), http=require('node:http'), path=require('node:path');
const {chromium}=require('../.image-tools/node_modules/playwright');
const pages=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
const label=process.argv[2]||'before';
fs.mkdirSync('.image-qa',{recursive:true});
const server=http.createServer((req,res)=>{
 const file=path.join(process.cwd(),decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(process.cwd()+path.sep)){res.writeHead(403).end();return;}
 try {const data=fs.readFileSync(file);res.setHeader('Content-Type',({'html':'text/html; charset=utf-8','css':'text/css','js':'text/javascript','webp':'image/webp','png':'image/png','jpg':'image/jpeg'})[file.split('.').pop()]||'application/octet-stream');res.end(data);}catch{res.writeHead(404).end();}
});
(async()=>{
 await new Promise(r=>server.listen(5191,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const results=[];
 try {
  for(const viewport of [{width:390,height:844},{width:1440,height:1000}]) {
   const context=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'no-preference'});
   for(const file of pages){
    const page=await context.newPage(), errors=[];
    page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
    await page.addInitScript(()=>{window.__lcp=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lcp.push({time:e.startTime,size:e.size,tag:e.element?.tagName,source:e.url,text:e.element?.textContent?.slice(0,90)}))).observe({type:'largest-contentful-paint',buffered:true});});
    await page.goto(`http://127.0.0.1:5191/${file}`,{waitUntil:'networkidle'});
    await page.waitForTimeout(3700);
    const initial=await page.evaluate(()=>({text:document.body.innerText,lcp:window.__lcp,images:[...document.images].map(i=>{const r=i.getBoundingClientRect();return {src:i.getAttribute('src'),currentSrc:i.currentSrc,width:r.width,height:r.height,top:r.top,loading:i.loading,priority:i.fetchPriority,naturalWidth:i.naturalWidth}}),scrollWidth:document.documentElement.scrollWidth}));
    await page.screenshot({path:`.image-qa/${label}-${viewport.width}-${file}.png`});
    for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(80);}
    await page.waitForTimeout(600);
    const broken=await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
    let gallery=[];
    if(file==='urunler.html'){
     for(const group of await page.locator('[data-product-gallery]').all()){
      for(const thumb of await group.locator('[data-thumbnail]').all()){
       await thumb.click();await page.waitForTimeout(170);
       const img=group.locator('[data-main-image]');await img.evaluate(i=>i.decode());
       gallery.push(await img.evaluate(i=>({src:i.getAttribute('src'),currentSrc:i.currentSrc,naturalWidth:i.naturalWidth,width:i.getAttribute('width'),height:i.getAttribute('height')})));
      }
     }
    }
    results.push({file,viewport,initial,broken,errors,gallery});
    console.log(file,viewport.width,'LCP',JSON.stringify(initial.lcp.at(-1)),'broken',broken.length,'errors',errors.length);
    await page.close();
   }
   await context.close();
  }
  fs.writeFileSync(`.image-qa/browser-${label}.json`,JSON.stringify(results,null,2));
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
