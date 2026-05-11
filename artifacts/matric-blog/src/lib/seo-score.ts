export function computeSeoScore(params: {title:string;metaTitle:string;metaDescription:string;focusKeyword:string;htmlContent:string;featuredImage?:string|null}): {score:number;breakdown:{label:string;ok:boolean}[]} {
  const plain = params.htmlContent.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const words = plain.split(/\s+/).filter(Boolean);
  const kw = params.focusKeyword.trim().toLowerCase();
  const titleLc = params.title.toLowerCase();
  const firstPara = plain.split(/\n+/)[0]?.toLowerCase()??'';
  const internalLinks=(params.htmlContent.match(/href="\//g)||[]).length;
  const imgs=(params.htmlContent.match(/<img\b/gi)||[]).length;
  const imgAlts=(params.htmlContent.match(/<img[^>]+alt=["']([^"']+)["']/gi)||[]).filter(m=>!/alt=["']\s*["']/i.test(m)).length;
  const breakdown=[
    {label:'Meta title length (~60)',ok:params.metaTitle.length>=30&&params.metaTitle.length<=60},
    {label:'Meta description (~150-160)',ok:params.metaDescription.length>=120&&params.metaDescription.length<=165},
    {label:'Keyword in title',ok:!kw||titleLc.includes(kw)},
    {label:'Keyword in first paragraph',ok:!kw||firstPara.includes(kw)},
    {label:'Images have alt text',ok:imgs===0||imgAlts>=Math.min(imgs,1)},
    {label:'Internal links (>=2)',ok:internalLinks>=2},
    {label:'Word count (>600)',ok:words.length>600},
  ];
  const max=breakdown.length*14;
  const earned=breakdown.reduce((a,b)=>a+(b.ok?14:0),0);
  return {score:Math.round((earned/max)*100),breakdown};
}