module.exports=[93695,(e,t,s)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,s)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,s)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,s)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,s)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,s)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},54619,e=>{"use strict";var t=e.i(64054),s=e.i(60035),r=e.i(27794),a=e.i(95037),n=e.i(69433),i=e.i(35863),o=e.i(46307),l=e.i(95834),u=e.i(9219),c=e.i(14368),d=e.i(6661),p=e.i(37833),g=e.i(48682),h=e.i(76929),x=e.i(83700),m=e.i(93695);e.i(53721);var f=e.i(51284),R=e.i(99708);let v=process.env.GEMINI_API_KEY,E=process.env.GEMINI_MODEL?.trim()||"gemini-2.5-flash",y=new Map,A={dashboard:`أنت مساعد ذكي ومفيد لمدير موقع ماتريكبلوغ. المستخدم موجود في صفحة لوحة التحكم (Dashboard).
    
المعلومات المتاحة:
- إحصائيات الموقع (عدد المقالات، الفئات، المشاهدات)
- آخر المقالات المنشورة

مهمتك:
1. قدّم نصائح ذكية لتحسين الموقع
2. اقترح أفكار لمقالات جديدة بناءً على الوضع الحالي
3. حلل الأداء واقترح تحسينات
4. كن ودوداً وكأنك صديق يساعد

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ترحيبية ودودة من 1-2 جمل",
  "suggestions": ["اقتراح 1", "اقتراح 2", "اقتراح 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف قصير" }
  ]
}`,posts:`أنت مساعد ذكي لمدير موقع ماتريكبلوغ. المستخدم في صفحة إدارة المقالات (Posts).

المعلومات المتاحة:
- قائمة المقالات مع حالاتها (منشور، مسودة، مجدول)

مهمتك:
1. اقترح تحسينات للمقالات الموجودة
2. نصائح لتنظيم المقالات وحذف المهمل
3. اقتراحات لمقالات جديدة بناءً على الفجوات
4. نصائح SEO عامة

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["اقتراح 1", "اقتراح 2", "اقتراح 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`,categories:`أنت مساعد ذكي لمدير موقع ماتريكبلوغ. المستخدم في صفحة إدارة الفئات (Categories).

مهمتك:
1. اقترح تصنيفات مقترحة لمدونة تقنية/إخبارية عربية
2. نصائح لتحسين هيكل التصنيفات
3. أفكار لتنظيم المحتوى بالفئات

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["اقتراح 1", "اقتراح 2", "اقتراح 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`,"ai-generate":`أنت مساعد ذكي ومبدع. المستخدم يستخدم أداة توليد المقالات بالذكاء الاصطناعي.

مهمتك:
1. اقترح مواضيع حصرية ومثيرة لمدونة تقنية عربية
2. نصائح لتحسين جودة المقالات المُولَّدة
3. أفكار لكلمات مفتاحية قوية
4. اقتراحات لتحسين البرومبت (prompt)

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة تحفيزية ودودة",
  "suggestions": ["اقتراح موضوع 1", "اقتراح موضوع 2", "اقتراح موضوع 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`,seo:`أنت خبير SEO ومساعد ذكي. المستخدم في صفحة أدوات SEO وتحليل AdSense.

مهمتك:
1. حلل المشاكل الموجودة واقترح حلولاً عملية
2. نصائح لتحسين ترتيب الموقع
3. إرشادات لاجتياز فحص AdSense
4. اقترح تحسينات تقنية للموقع

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["نصيحة SEO 1", "نصيحة SEO 2", "نصيحة SEO 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "fix", "description": "وصف" }
  ]
}`,"youtube-to-blog":`أنت مساعد ذكي. المستخدم يحول فيديوهات يوتيوب إلى مقالات.

مهمتك:
1. اقترح قنوات يوتيوب تقنية عربية مفيدة للتحويل
2. نصائح لتحسين جودة المقالات المُستخرجة
3. أفكار لاستغلال الفيديوهات القديمة
4. نصائح لكتابة تعليمات إضافية فعالة

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["اقتراح 1", "اقتراح 2", "اقتراح 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`,"post-editor":`أنت مساعد ذكي لكتابة المحتوى. المستخدم في محرر المقالات.

مهمتك:
1. نصائح لتحسين جودة الكتابة
2. اقتراحات لتحسين SEO المقال
3. تذكير بأفضل الممارسات
4. اقتراح تحسينات على المحتوى

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["نصيحة 1", "نصيحة 2", "نصيحة 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`};async function w(e){let t=v?.trim();if(!t)return null;try{let s=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${E}:generateContent?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.7,maxOutputTokens:2048,topP:.9,topK:40}}),signal:AbortSignal.timeout(3e4)});if(!s.ok)return null;let r=await s.json();return r?.candidates?.[0]?.content?.parts?.[0]?.text||null}catch{return null}}async function S(e){if(!v?.trim())return R.NextResponse.json({error:"مفتاح Gemini غير مضبوط"},{status:500});try{let t,s,r=Date.now()-1e4;for(let[e,t]of y)t<r&&y.delete(e);let{page:a,context:n,message:i}=await e.json(),o=(a||"dashboard").replace(/^\//,""),l=`${o}|${i||""}`,u=Date.now(),c=y.get(l);if(c&&u-c<1e3)return R.NextResponse.json({skipped:!0});y.set(l,u);let d=(t=A[o]||A.dashboard,s="",(n&&(s=`

معلومات إضافية عن الوضع الحالي:
${JSON.stringify(n,null,2)}`),i)?`${t}${s}

سؤال المستخدم: "${i}"

أجب على سؤال المستخدم بشكل مباشر ومفيد.`:`${t}${s}`),p=await w(d);if(!p)return R.NextResponse.json({message:"أهلاً بك! 👋 أنا مساعدك الذكي. اسألني عن أي شيء أو اختر من الاقتراحات أدناه.",suggestions:["كيف يمكنني تحسين أداء الموقع؟","أقترح عليك مواضيع جديدة","ساعدني في تحسين SEO"],quickActions:[]});let g=function(e){try{return JSON.parse(e)}catch{let t=e.match(/```(?:json)?\s*([\s\S]*?)```/);if(t)try{return JSON.parse(t[1].trim())}catch{}let s=e.indexOf("{"),r=e.lastIndexOf("}");if(-1!==s&&r>s)try{return JSON.parse(e.slice(s,r+1))}catch{}return null}}(p);if(!g)return R.NextResponse.json({message:"مرحباً! كيف يمكنني مساعدتك اليوم؟",suggestions:["أعطني نصائح لتحسين المحتوى","اقترح أدوات جديدة","كيف أحسن ترتيب الموقع"],quickActions:[]});return R.NextResponse.json({message:g.message||"مرحباً!",suggestions:Array.isArray(g.suggestions)?g.suggestions:[],quickActions:Array.isArray(g.quickActions)?g.quickActions:[]})}catch{return R.NextResponse.json({message:"عذراً، حدث خطأ. حاول مرة أخرى.",suggestions:[],quickActions:[]})}}e.s(["POST",0,S],12843);var O=e.i(12843);let b=new t.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/ai-assistant/route",pathname:"/api/ai-assistant",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/artifacts/matric-blog/src/app/api/ai-assistant/route.ts",nextConfigOutput:"",userland:O,...{}}),{workAsyncStorage:N,workUnitAsyncStorage:C,serverHooks:k}=b;async function q(e,t,r){r.requestMeta&&(0,a.setRequestMeta)(e,r.requestMeta),b.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/ai-assistant/route";R=R.replace(/\/index$/,"")||"/";let v=await b.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:E,deploymentId:y,params:A,nextConfig:w,parsedUrl:S,isDraftMode:O,prerenderManifest:N,routerServerContext:C,isOnDemandRevalidate:k,revalidateOnlyGenerated:q,resolvedPathname:P,clientReferenceManifest:T,serverActionsManifest:j}=v,_=(0,o.normalizeAppPath)(R),I=!!(N.dynamicRoutes[_]||N.routes[P]),M=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,S,!1):t.end("This page could not be found"),null);if(I&&!O){let e=!!N.routes[P],t=N.dynamicRoutes[_];if(t&&!1===t.fallback&&!e){if(w.adapterPath)return await M();throw new m.NoFallbackError}}let $=null;!I||b.isDev||O||($="/index"===($=P)?"/":$);let D=!0===b.isDev||!I,H=I&&!D;j&&T&&(0,i.setManifestsSingleton)({page:R,clientReferenceManifest:T,serverActionsManifest:j});let U=e.method||"GET",J=(0,n.getTracer)(),K=J.getActiveScopeSpan(),F=!!(null==C?void 0:C.isWrappedByNextServer),B=!!(0,a.getRequestMeta)(e,"minimalMode"),G=(0,a.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,w,N,B);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let L={params:A,previewProps:N.preview,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:D,incrementalCache:G,cacheLifeProfiles:w.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,s,r,a)=>b.onRequestError(e,t,r,a,C)},sharedContext:{buildId:E,deploymentId:y}},V=new l.NodeNextRequest(e),W=new l.NodeNextResponse(t),X=u.NextRequestAdapter.fromNodeNextRequest(V,(0,u.signalFromNodeResponse)(t));try{let a,i=async e=>b.handle(X,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let s=J.getRootSpanAttributes();if(!s)return;if(s.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${s.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=s.get("next.route");if(r){let t=`${U} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),a&&a!==e&&(a.setAttribute("http.route",r),a.updateName(t))}else e.updateName(`${U} ${R}`)}),o=async a=>{var n,o;let l=async({previousCacheEntry:s})=>{try{if(!B&&k&&q&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(a);e.fetchMetrics=L.renderOpts.fetchMetrics;let o=L.renderOpts.pendingWaitUntil;o&&r.waitUntil&&(r.waitUntil(o),o=void 0);let l=L.renderOpts.collectedTags;if(!I)return await (0,p.sendResponse)(V,W,n,L.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[x.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let s=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,r=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:s,expire:r}}}}catch(t){throw(null==s?void 0:s.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:k})},!1,C),t}},u=await b.handleResponse({req:e,nextConfig:w,cacheKey:$,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:k,revalidateOnlyGenerated:q,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:B});if(!I)return null;if((null==u||null==(n=u.value)?void 0:n.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(o=u.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",k?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,g.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&I||c.delete(x.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,h.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(V,W,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};F&&K?await o(K):(a=J.getActiveScopeSpan(),await J.withPropagatedContext(e.headers,()=>J.trace(c.BaseServerSpan.handleRequest,{spanName:`${U} ${R}`,kind:n.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},o),void 0,!F))}catch(t){if(t instanceof m.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:k})},!1,C),I)throw t;return await (0,p.sendResponse)(V,W,new Response(null,{status:500})),null}}e.s(["handler",0,q,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:C})},"routeModule",0,b,"serverHooks",0,k,"workAsyncStorage",0,N,"workUnitAsyncStorage",0,C],54619)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0sa~u5z._.js.map