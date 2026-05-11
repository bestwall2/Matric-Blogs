export function slugify(input:string):string{
  const map:Record<string,string>={أ:'a',إ:'i',آ:'a',ب:'b',ت:'t',ث:'th',ج:'j',ح:'h',خ:'kh',د:'d',ذ:'dh',ر:'r',ز:'z',س:'s',ش:'sh',ص:'s',ض:'d',ط:'t',ظ:'z',ع:'a',غ:'gh',ف:'f',ق:'q',ك:'k',ل:'l',م:'m',ن:'n',ه:'h',و:'w',ي:'y',ء:'',ئ:'y',ؤ:'w',ى:'a',ة:'h',لا:'la'};
  let s=input.trim().toLowerCase();
  for(const[ar,lat]of Object.entries(map)){s=s.split(ar).join(lat);}
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,80);
}