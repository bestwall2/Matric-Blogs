module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/artifacts/matric-blog/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatDate",
    ()=>formatDate,
    "getApiBase",
    ()=>getApiBase,
    "getReadingTime",
    ()=>getReadingTime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$5$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.5.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$5$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Intl.DateTimeFormat("ar-MA", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(new Date(dateStr));
}
function getReadingTime(content, rt) {
    if (rt) return rt;
    if (!content) return 1;
    const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}
function getApiBase() {
    const base = process.env.BASE_PATH ?? "/";
    return base.replace(/\/$/, "") + "/api";
}
}),
"[project]/artifacts/matric-blog/src/components/ui/tooltip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tooltip",
    ()=>Tooltip,
    "TooltipContent",
    ()=>TooltipContent,
    "TooltipProvider",
    ()=>TooltipProvider,
    "TooltipTrigger",
    ()=>TooltipTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$2$2e$8_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$14_$5f40$types$2b$reac_ab0d0da4ee6b1f28831a19c3e4e15a95$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-tooltip@1.2.8_@types+react-dom@19.2.3_@types+react@19.2.14__@types+reac_ab0d0da4ee6b1f28831a19c3e4e15a95/node_modules/@radix-ui/react-tooltip/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$matric$2d$blog$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/matric-blog/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const TooltipProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$2$2e$8_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$14_$5f40$types$2b$reac_ab0d0da4ee6b1f28831a19c3e4e15a95$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"];
const Tooltip = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$2$2e$8_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$14_$5f40$types$2b$reac_ab0d0da4ee6b1f28831a19c3e4e15a95$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
const TooltipTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$2$2e$8_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$14_$5f40$types$2b$reac_ab0d0da4ee6b1f28831a19c3e4e15a95$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"];
const TooltipContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$2$2e$8_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$14_$5f40$types$2b$reac_ab0d0da4ee6b1f28831a19c3e4e15a95$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$2$2e$8_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$14_$5f40$types$2b$reac_ab0d0da4ee6b1f28831a19c3e4e15a95$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$matric$2d$blog$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/artifacts/matric-blog/src/components/ui/tooltip.tsx",
            lineNumber: 19,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/artifacts/matric-blog/src/components/ui/tooltip.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TooltipContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$2$2e$8_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$14_$5f40$types$2b$reac_ab0d0da4ee6b1f28831a19c3e4e15a95$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"].displayName;
;
}),
"[project]/lib/api-client-react/dist/custom-fetch.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "ResponseParseError",
    ()=>ResponseParseError,
    "customFetch",
    ()=>customFetch,
    "setAuthTokenGetter",
    ()=>setAuthTokenGetter,
    "setBaseUrl",
    ()=>setBaseUrl
]);
const NO_BODY_STATUS = new Set([
    204,
    205,
    304
]);
const DEFAULT_JSON_ACCEPT = "application/json, application/problem+json";
// ---------------------------------------------------------------------------
// Module-level configuration
// ---------------------------------------------------------------------------
let _baseUrl = null;
let _authTokenGetter = null;
function setBaseUrl(url) {
    _baseUrl = url ? url.replace(/\/+$/, "") : null;
}
function setAuthTokenGetter(getter) {
    _authTokenGetter = getter;
}
function isRequest(input) {
    return typeof Request !== "undefined" && input instanceof Request;
}
function resolveMethod(input, explicitMethod) {
    if (explicitMethod) return explicitMethod.toUpperCase();
    if (isRequest(input)) return input.method.toUpperCase();
    return "GET";
}
// Use loose check for URL — some runtimes (e.g. React Native) polyfill URL
// differently, so `instanceof URL` can fail.
function isUrl(input) {
    return typeof URL !== "undefined" && input instanceof URL;
}
function applyBaseUrl(input) {
    if (!_baseUrl) return input;
    const url = resolveUrl(input);
    // Only prepend to relative paths (starting with /)
    if (!url.startsWith("/")) return input;
    const absolute = `${_baseUrl}${url}`;
    if (typeof input === "string") return absolute;
    if (isUrl(input)) return new URL(absolute);
    return new Request(absolute, input);
}
function resolveUrl(input) {
    if (typeof input === "string") return input;
    if (isUrl(input)) return input.toString();
    return input.url;
}
function mergeHeaders(...sources) {
    const headers = new Headers();
    for (const source of sources){
        if (!source) continue;
        new Headers(source).forEach((value, key)=>{
            headers.set(key, value);
        });
    }
    return headers;
}
function getMediaType(headers) {
    const value = headers.get("content-type");
    return value ? value.split(";", 1)[0].trim().toLowerCase() : null;
}
function isJsonMediaType(mediaType) {
    return mediaType === "application/json" || Boolean(mediaType?.endsWith("+json"));
}
function isTextMediaType(mediaType) {
    return Boolean(mediaType && (mediaType.startsWith("text/") || mediaType === "application/xml" || mediaType === "text/xml" || mediaType.endsWith("+xml") || mediaType === "application/x-www-form-urlencoded"));
}
// Use strict equality: in browsers, `response.body` is `null` when the
// response genuinely has no content.  In React Native, `response.body` is
// always `undefined` because the ReadableStream API is not implemented —
// even when the response carries a full payload readable via `.text()` or
// `.json()`.  Loose equality (`== null`) matches both `null` and `undefined`,
// which causes every React Native response to be treated as empty.
function hasNoBody(response, method) {
    if (method === "HEAD") return true;
    if (NO_BODY_STATUS.has(response.status)) return true;
    if (response.headers.get("content-length") === "0") return true;
    if (response.body === null) return true;
    return false;
}
function stripBom(text) {
    return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}
function looksLikeJson(text) {
    const trimmed = text.trimStart();
    return trimmed.startsWith("{") || trimmed.startsWith("[");
}
function getStringField(value, key) {
    if (!value || typeof value !== "object") return undefined;
    const candidate = value[key];
    if (typeof candidate !== "string") return undefined;
    const trimmed = candidate.trim();
    return trimmed === "" ? undefined : trimmed;
}
function truncate(text, maxLength = 300) {
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
function buildErrorMessage(response, data) {
    const prefix = `HTTP ${response.status} ${response.statusText}`;
    if (typeof data === "string") {
        const text = data.trim();
        return text ? `${prefix}: ${truncate(text)}` : prefix;
    }
    const title = getStringField(data, "title");
    const detail = getStringField(data, "detail");
    const message = getStringField(data, "message") ?? getStringField(data, "error_description") ?? getStringField(data, "error");
    if (title && detail) return `${prefix}: ${title} — ${detail}`;
    if (detail) return `${prefix}: ${detail}`;
    if (message) return `${prefix}: ${message}`;
    if (title) return `${prefix}: ${title}`;
    return prefix;
}
class ApiError extends Error {
    name = "ApiError";
    status;
    statusText;
    data;
    headers;
    response;
    method;
    url;
    constructor(response, data, requestInfo){
        super(buildErrorMessage(response, data));
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = response.status;
        this.statusText = response.statusText;
        this.data = data;
        this.headers = response.headers;
        this.response = response;
        this.method = requestInfo.method;
        this.url = response.url || requestInfo.url;
    }
}
class ResponseParseError extends Error {
    name = "ResponseParseError";
    status;
    statusText;
    headers;
    response;
    method;
    url;
    rawBody;
    cause;
    constructor(response, rawBody, cause, requestInfo){
        super(`Failed to parse response from ${requestInfo.method} ${response.url || requestInfo.url} ` + `(${response.status} ${response.statusText}) as JSON`);
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = response.status;
        this.statusText = response.statusText;
        this.headers = response.headers;
        this.response = response;
        this.method = requestInfo.method;
        this.url = response.url || requestInfo.url;
        this.rawBody = rawBody;
        this.cause = cause;
    }
}
async function parseJsonBody(response, requestInfo) {
    const raw = await response.text();
    const normalized = stripBom(raw);
    if (normalized.trim() === "") {
        return null;
    }
    try {
        return JSON.parse(normalized);
    } catch (cause) {
        throw new ResponseParseError(response, raw, cause, requestInfo);
    }
}
async function parseErrorBody(response, method) {
    if (hasNoBody(response, method)) {
        return null;
    }
    const mediaType = getMediaType(response.headers);
    // Fall back to text when blob() is unavailable (e.g. some React Native builds).
    if (mediaType && !isJsonMediaType(mediaType) && !isTextMediaType(mediaType)) {
        return typeof response.blob === "function" ? response.blob() : response.text();
    }
    const raw = await response.text();
    const normalized = stripBom(raw);
    const trimmed = normalized.trim();
    if (trimmed === "") {
        return null;
    }
    if (isJsonMediaType(mediaType) || looksLikeJson(normalized)) {
        try {
            return JSON.parse(normalized);
        } catch  {
            return raw;
        }
    }
    return raw;
}
function inferResponseType(response) {
    const mediaType = getMediaType(response.headers);
    if (isJsonMediaType(mediaType)) return "json";
    if (isTextMediaType(mediaType) || mediaType == null) return "text";
    return "blob";
}
async function parseSuccessBody(response, responseType, requestInfo) {
    if (hasNoBody(response, requestInfo.method)) {
        return null;
    }
    const effectiveType = responseType === "auto" ? inferResponseType(response) : responseType;
    switch(effectiveType){
        case "json":
            return parseJsonBody(response, requestInfo);
        case "text":
            {
                const text = await response.text();
                return text === "" ? null : text;
            }
        case "blob":
            if (typeof response.blob !== "function") {
                throw new TypeError("Blob responses are not supported in this runtime. " + "Use responseType \"json\" or \"text\" instead.");
            }
            return response.blob();
    }
}
async function customFetch(input, options = {}) {
    input = applyBaseUrl(input);
    const { responseType = "auto", headers: headersInit, ...init } = options;
    const method = resolveMethod(input, init.method);
    if (init.body != null && (method === "GET" || method === "HEAD")) {
        throw new TypeError(`customFetch: ${method} requests cannot have a body.`);
    }
    const headers = mergeHeaders(isRequest(input) ? input.headers : undefined, headersInit);
    if (typeof init.body === "string" && !headers.has("content-type") && looksLikeJson(init.body)) {
        headers.set("content-type", "application/json");
    }
    if (responseType === "json" && !headers.has("accept")) {
        headers.set("accept", DEFAULT_JSON_ACCEPT);
    }
    // Attach bearer token when an auth getter is configured and no
    // Authorization header has been explicitly provided.
    if (_authTokenGetter && !headers.has("authorization")) {
        const token = await _authTokenGetter();
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
    }
    const requestInfo = {
        method,
        url: resolveUrl(input)
    };
    const response = await fetch(input, {
        ...init,
        method,
        headers
    });
    if (!response.ok) {
        const errorData = await parseErrorBody(response, method);
        throw new ApiError(response, errorData, requestInfo);
    }
    return await parseSuccessBody(response, responseType, requestInfo);
}
}),
"[project]/lib/api-client-react/dist/generated/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aiGeneratePost",
    ()=>aiGeneratePost,
    "aiImproveContent",
    ()=>aiImproveContent,
    "createCategory",
    ()=>createCategory,
    "createPost",
    ()=>createPost,
    "deletePost",
    ()=>deletePost,
    "getAiGeneratePostMutationOptions",
    ()=>getAiGeneratePostMutationOptions,
    "getAiGeneratePostUrl",
    ()=>getAiGeneratePostUrl,
    "getAiImproveContentMutationOptions",
    ()=>getAiImproveContentMutationOptions,
    "getAiImproveContentUrl",
    ()=>getAiImproveContentUrl,
    "getCreateCategoryMutationOptions",
    ()=>getCreateCategoryMutationOptions,
    "getCreateCategoryUrl",
    ()=>getCreateCategoryUrl,
    "getCreatePostMutationOptions",
    ()=>getCreatePostMutationOptions,
    "getCreatePostUrl",
    ()=>getCreatePostUrl,
    "getDeletePostMutationOptions",
    ()=>getDeletePostMutationOptions,
    "getDeletePostUrl",
    ()=>getDeletePostUrl,
    "getFeaturedPosts",
    ()=>getFeaturedPosts,
    "getGetFeaturedPostsQueryKey",
    ()=>getGetFeaturedPostsQueryKey,
    "getGetFeaturedPostsQueryOptions",
    ()=>getGetFeaturedPostsQueryOptions,
    "getGetFeaturedPostsUrl",
    ()=>getGetFeaturedPostsUrl,
    "getGetPostByIdQueryKey",
    ()=>getGetPostByIdQueryKey,
    "getGetPostByIdQueryOptions",
    ()=>getGetPostByIdQueryOptions,
    "getGetPostByIdUrl",
    ()=>getGetPostByIdUrl,
    "getGetPostBySlugQueryKey",
    ()=>getGetPostBySlugQueryKey,
    "getGetPostBySlugQueryOptions",
    ()=>getGetPostBySlugQueryOptions,
    "getGetPostBySlugUrl",
    ()=>getGetPostBySlugUrl,
    "getGetPostsStatsQueryKey",
    ()=>getGetPostsStatsQueryKey,
    "getGetPostsStatsQueryOptions",
    ()=>getGetPostsStatsQueryOptions,
    "getGetPostsStatsUrl",
    ()=>getGetPostsStatsUrl,
    "getHealthCheckQueryKey",
    ()=>getHealthCheckQueryKey,
    "getHealthCheckQueryOptions",
    ()=>getHealthCheckQueryOptions,
    "getHealthCheckUrl",
    ()=>getHealthCheckUrl,
    "getIncrementPostViewMutationOptions",
    ()=>getIncrementPostViewMutationOptions,
    "getIncrementPostViewUrl",
    ()=>getIncrementPostViewUrl,
    "getListAdminPostsQueryKey",
    ()=>getListAdminPostsQueryKey,
    "getListAdminPostsQueryOptions",
    ()=>getListAdminPostsQueryOptions,
    "getListAdminPostsUrl",
    ()=>getListAdminPostsUrl,
    "getListCategoriesQueryKey",
    ()=>getListCategoriesQueryKey,
    "getListCategoriesQueryOptions",
    ()=>getListCategoriesQueryOptions,
    "getListCategoriesUrl",
    ()=>getListCategoriesUrl,
    "getListPostsQueryKey",
    ()=>getListPostsQueryKey,
    "getListPostsQueryOptions",
    ()=>getListPostsQueryOptions,
    "getListPostsUrl",
    ()=>getListPostsUrl,
    "getPostById",
    ()=>getPostById,
    "getPostBySlug",
    ()=>getPostBySlug,
    "getPostsStats",
    ()=>getPostsStats,
    "getSubscribeNewsletterMutationOptions",
    ()=>getSubscribeNewsletterMutationOptions,
    "getSubscribeNewsletterUrl",
    ()=>getSubscribeNewsletterUrl,
    "getUpdatePostMutationOptions",
    ()=>getUpdatePostMutationOptions,
    "getUpdatePostUrl",
    ()=>getUpdatePostUrl,
    "getUploadImageMutationOptions",
    ()=>getUploadImageMutationOptions,
    "getUploadImageUrl",
    ()=>getUploadImageUrl,
    "healthCheck",
    ()=>healthCheck,
    "incrementPostView",
    ()=>incrementPostView,
    "listAdminPosts",
    ()=>listAdminPosts,
    "listCategories",
    ()=>listCategories,
    "listPosts",
    ()=>listPosts,
    "subscribeNewsletter",
    ()=>subscribeNewsletter,
    "updatePost",
    ()=>updatePost,
    "uploadImage",
    ()=>uploadImage,
    "useAiGeneratePost",
    ()=>useAiGeneratePost,
    "useAiImproveContent",
    ()=>useAiImproveContent,
    "useCreateCategory",
    ()=>useCreateCategory,
    "useCreatePost",
    ()=>useCreatePost,
    "useDeletePost",
    ()=>useDeletePost,
    "useGetFeaturedPosts",
    ()=>useGetFeaturedPosts,
    "useGetPostById",
    ()=>useGetPostById,
    "useGetPostBySlug",
    ()=>useGetPostBySlug,
    "useGetPostsStats",
    ()=>useGetPostsStats,
    "useHealthCheck",
    ()=>useHealthCheck,
    "useIncrementPostView",
    ()=>useIncrementPostView,
    "useListAdminPosts",
    ()=>useListAdminPosts,
    "useListCategories",
    ()=>useListCategories,
    "useListPosts",
    ()=>useListPosts,
    "useSubscribeNewsletter",
    ()=>useSubscribeNewsletter,
    "useUpdatePost",
    ()=>useUpdatePost,
    "useUploadImage",
    ()=>useUploadImage
]);
/**
 * Generated by orval v8.5.3 🍺
 * Do not edit manually.
 * Api
 * MatricBlog API
 * OpenAPI spec version: 0.1.0
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.1.0/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.1.0/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client-react/dist/custom-fetch.js [app-ssr] (ecmascript)");
;
;
const getHealthCheckUrl = ()=>{
    return `/api/healthz`;
};
const healthCheck = async (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getHealthCheckUrl(), {
        ...options,
        method: "GET"
    });
};
const getHealthCheckQueryKey = ()=>{
    return [
        `/api/healthz`
    ];
};
const getHealthCheckQueryOptions = (options)=>{
    const { query: queryOptions, request: requestOptions } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getHealthCheckQueryKey();
    const queryFn = ({ signal })=>healthCheck({
            signal,
            ...requestOptions
        });
    return {
        queryKey,
        queryFn,
        ...queryOptions
    };
};
function useHealthCheck(options) {
    const queryOptions = getHealthCheckQueryOptions(options);
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(queryOptions);
    return {
        ...query,
        queryKey: queryOptions.queryKey
    };
}
const getListPostsUrl = (params)=>{
    const normalizedParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value])=>{
        if (value !== undefined) {
            normalizedParams.append(key, value === null ? "null" : value.toString());
        }
    });
    const stringifiedParams = normalizedParams.toString();
    return stringifiedParams.length > 0 ? `/api/posts?${stringifiedParams}` : `/api/posts`;
};
const listPosts = async (params, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getListPostsUrl(params), {
        ...options,
        method: "GET"
    });
};
const getListPostsQueryKey = (params)=>{
    return [
        `/api/posts`,
        ...params ? [
            params
        ] : []
    ];
};
const getListPostsQueryOptions = (params, options)=>{
    const { query: queryOptions, request: requestOptions } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getListPostsQueryKey(params);
    const queryFn = ({ signal })=>listPosts(params, {
            signal,
            ...requestOptions
        });
    return {
        queryKey,
        queryFn,
        ...queryOptions
    };
};
function useListPosts(params, options) {
    const queryOptions = getListPostsQueryOptions(params, options);
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(queryOptions);
    return {
        ...query,
        queryKey: queryOptions.queryKey
    };
}
const getGetFeaturedPostsUrl = (params)=>{
    const normalizedParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value])=>{
        if (value !== undefined) {
            normalizedParams.append(key, value === null ? "null" : value.toString());
        }
    });
    const stringifiedParams = normalizedParams.toString();
    return stringifiedParams.length > 0 ? `/api/posts/featured?${stringifiedParams}` : `/api/posts/featured`;
};
const getFeaturedPosts = async (params, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getGetFeaturedPostsUrl(params), {
        ...options,
        method: "GET"
    });
};
const getGetFeaturedPostsQueryKey = (params)=>{
    return [
        `/api/posts/featured`,
        ...params ? [
            params
        ] : []
    ];
};
const getGetFeaturedPostsQueryOptions = (params, options)=>{
    const { query: queryOptions, request: requestOptions } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGetFeaturedPostsQueryKey(params);
    const queryFn = ({ signal })=>getFeaturedPosts(params, {
            signal,
            ...requestOptions
        });
    return {
        queryKey,
        queryFn,
        ...queryOptions
    };
};
function useGetFeaturedPosts(params, options) {
    const queryOptions = getGetFeaturedPostsQueryOptions(params, options);
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(queryOptions);
    return {
        ...query,
        queryKey: queryOptions.queryKey
    };
}
const getGetPostsStatsUrl = ()=>{
    return `/api/posts/stats`;
};
const getPostsStats = async (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getGetPostsStatsUrl(), {
        ...options,
        method: "GET"
    });
};
const getGetPostsStatsQueryKey = ()=>{
    return [
        `/api/posts/stats`
    ];
};
const getGetPostsStatsQueryOptions = (options)=>{
    const { query: queryOptions, request: requestOptions } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGetPostsStatsQueryKey();
    const queryFn = ({ signal })=>getPostsStats({
            signal,
            ...requestOptions
        });
    return {
        queryKey,
        queryFn,
        ...queryOptions
    };
};
function useGetPostsStats(options) {
    const queryOptions = getGetPostsStatsQueryOptions(options);
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(queryOptions);
    return {
        ...query,
        queryKey: queryOptions.queryKey
    };
}
const getListAdminPostsUrl = ()=>{
    return `/api/posts/admin`;
};
const listAdminPosts = async (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getListAdminPostsUrl(), {
        ...options,
        method: "GET"
    });
};
const getListAdminPostsQueryKey = ()=>{
    return [
        `/api/posts/admin`
    ];
};
const getListAdminPostsQueryOptions = (options)=>{
    const { query: queryOptions, request: requestOptions } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getListAdminPostsQueryKey();
    const queryFn = ({ signal })=>listAdminPosts({
            signal,
            ...requestOptions
        });
    return {
        queryKey,
        queryFn,
        ...queryOptions
    };
};
function useListAdminPosts(options) {
    const queryOptions = getListAdminPostsQueryOptions(options);
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(queryOptions);
    return {
        ...query,
        queryKey: queryOptions.queryKey
    };
}
const getGetPostBySlugUrl = (slug)=>{
    return `/api/posts/slug/${slug}`;
};
const getPostBySlug = async (slug, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getGetPostBySlugUrl(slug), {
        ...options,
        method: "GET"
    });
};
const getGetPostBySlugQueryKey = (slug)=>{
    return [
        `/api/posts/slug/${slug}`
    ];
};
const getGetPostBySlugQueryOptions = (slug, options)=>{
    const { query: queryOptions, request: requestOptions } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGetPostBySlugQueryKey(slug);
    const queryFn = ({ signal })=>getPostBySlug(slug, {
            signal,
            ...requestOptions
        });
    return {
        queryKey,
        queryFn,
        enabled: !!slug,
        ...queryOptions
    };
};
function useGetPostBySlug(slug, options) {
    const queryOptions = getGetPostBySlugQueryOptions(slug, options);
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(queryOptions);
    return {
        ...query,
        queryKey: queryOptions.queryKey
    };
}
const getGetPostByIdUrl = (id)=>{
    return `/api/posts/id/${id}`;
};
const getPostById = async (id, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getGetPostByIdUrl(id), {
        ...options,
        method: "GET"
    });
};
const getGetPostByIdQueryKey = (id)=>{
    return [
        `/api/posts/id/${id}`
    ];
};
const getGetPostByIdQueryOptions = (id, options)=>{
    const { query: queryOptions, request: requestOptions } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGetPostByIdQueryKey(id);
    const queryFn = ({ signal })=>getPostById(id, {
            signal,
            ...requestOptions
        });
    return {
        queryKey,
        queryFn,
        enabled: !!id,
        ...queryOptions
    };
};
function useGetPostById(id, options) {
    const queryOptions = getGetPostByIdQueryOptions(id, options);
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(queryOptions);
    return {
        ...query,
        queryKey: queryOptions.queryKey
    };
}
const getUpdatePostUrl = (id)=>{
    return `/api/posts/${id}`;
};
const updatePost = async (id, postInput, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getUpdatePostUrl(id), {
        ...options,
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        },
        body: JSON.stringify(postInput)
    });
};
const getUpdatePostMutationOptions = (options)=>{
    const mutationKey = [
        "updatePost"
    ];
    const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
        ...options,
        mutation: {
            ...options.mutation,
            mutationKey
        }
    } : {
        mutation: {
            mutationKey
        },
        request: undefined
    };
    const mutationFn = (props)=>{
        const { id, data } = props ?? {};
        return updatePost(id, data, requestOptions);
    };
    return {
        mutationFn,
        ...mutationOptions
    };
};
const useUpdatePost = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(getUpdatePostMutationOptions(options));
};
const getDeletePostUrl = (id)=>{
    return `/api/posts/${id}`;
};
const deletePost = async (id, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getDeletePostUrl(id), {
        ...options,
        method: "DELETE"
    });
};
const getDeletePostMutationOptions = (options)=>{
    const mutationKey = [
        "deletePost"
    ];
    const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
        ...options,
        mutation: {
            ...options.mutation,
            mutationKey
        }
    } : {
        mutation: {
            mutationKey
        },
        request: undefined
    };
    const mutationFn = (props)=>{
        const { id } = props ?? {};
        return deletePost(id, requestOptions);
    };
    return {
        mutationFn,
        ...mutationOptions
    };
};
const useDeletePost = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(getDeletePostMutationOptions(options));
};
const getCreatePostUrl = ()=>{
    return `/api/posts/create`;
};
const createPost = async (postInput, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getCreatePostUrl(), {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        },
        body: JSON.stringify(postInput)
    });
};
const getCreatePostMutationOptions = (options)=>{
    const mutationKey = [
        "createPost"
    ];
    const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
        ...options,
        mutation: {
            ...options.mutation,
            mutationKey
        }
    } : {
        mutation: {
            mutationKey
        },
        request: undefined
    };
    const mutationFn = (props)=>{
        const { data } = props ?? {};
        return createPost(data, requestOptions);
    };
    return {
        mutationFn,
        ...mutationOptions
    };
};
const useCreatePost = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(getCreatePostMutationOptions(options));
};
const getIncrementPostViewUrl = ()=>{
    return `/api/posts/view`;
};
const incrementPostView = async (viewInput, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getIncrementPostViewUrl(), {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        },
        body: JSON.stringify(viewInput)
    });
};
const getIncrementPostViewMutationOptions = (options)=>{
    const mutationKey = [
        "incrementPostView"
    ];
    const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
        ...options,
        mutation: {
            ...options.mutation,
            mutationKey
        }
    } : {
        mutation: {
            mutationKey
        },
        request: undefined
    };
    const mutationFn = (props)=>{
        const { data } = props ?? {};
        return incrementPostView(data, requestOptions);
    };
    return {
        mutationFn,
        ...mutationOptions
    };
};
const useIncrementPostView = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(getIncrementPostViewMutationOptions(options));
};
const getListCategoriesUrl = ()=>{
    return `/api/categories`;
};
const listCategories = async (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getListCategoriesUrl(), {
        ...options,
        method: "GET"
    });
};
const getListCategoriesQueryKey = ()=>{
    return [
        `/api/categories`
    ];
};
const getListCategoriesQueryOptions = (options)=>{
    const { query: queryOptions, request: requestOptions } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getListCategoriesQueryKey();
    const queryFn = ({ signal })=>listCategories({
            signal,
            ...requestOptions
        });
    return {
        queryKey,
        queryFn,
        ...queryOptions
    };
};
function useListCategories(options) {
    const queryOptions = getListCategoriesQueryOptions(options);
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(queryOptions);
    return {
        ...query,
        queryKey: queryOptions.queryKey
    };
}
const getCreateCategoryUrl = ()=>{
    return `/api/categories`;
};
const createCategory = async (categoryInput, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getCreateCategoryUrl(), {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        },
        body: JSON.stringify(categoryInput)
    });
};
const getCreateCategoryMutationOptions = (options)=>{
    const mutationKey = [
        "createCategory"
    ];
    const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
        ...options,
        mutation: {
            ...options.mutation,
            mutationKey
        }
    } : {
        mutation: {
            mutationKey
        },
        request: undefined
    };
    const mutationFn = (props)=>{
        const { data } = props ?? {};
        return createCategory(data, requestOptions);
    };
    return {
        mutationFn,
        ...mutationOptions
    };
};
const useCreateCategory = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(getCreateCategoryMutationOptions(options));
};
const getSubscribeNewsletterUrl = ()=>{
    return `/api/newsletter`;
};
const subscribeNewsletter = async (newsletterInput, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getSubscribeNewsletterUrl(), {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        },
        body: JSON.stringify(newsletterInput)
    });
};
const getSubscribeNewsletterMutationOptions = (options)=>{
    const mutationKey = [
        "subscribeNewsletter"
    ];
    const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
        ...options,
        mutation: {
            ...options.mutation,
            mutationKey
        }
    } : {
        mutation: {
            mutationKey
        },
        request: undefined
    };
    const mutationFn = (props)=>{
        const { data } = props ?? {};
        return subscribeNewsletter(data, requestOptions);
    };
    return {
        mutationFn,
        ...mutationOptions
    };
};
const useSubscribeNewsletter = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(getSubscribeNewsletterMutationOptions(options));
};
const getAiGeneratePostUrl = ()=>{
    return `/api/ai/generate`;
};
const aiGeneratePost = async (aiGenerateInput, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getAiGeneratePostUrl(), {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        },
        body: JSON.stringify(aiGenerateInput)
    });
};
const getAiGeneratePostMutationOptions = (options)=>{
    const mutationKey = [
        "aiGeneratePost"
    ];
    const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
        ...options,
        mutation: {
            ...options.mutation,
            mutationKey
        }
    } : {
        mutation: {
            mutationKey
        },
        request: undefined
    };
    const mutationFn = (props)=>{
        const { data } = props ?? {};
        return aiGeneratePost(data, requestOptions);
    };
    return {
        mutationFn,
        ...mutationOptions
    };
};
const useAiGeneratePost = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(getAiGeneratePostMutationOptions(options));
};
const getAiImproveContentUrl = ()=>{
    return `/api/ai/improve`;
};
const aiImproveContent = async (aiImproveInput, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getAiImproveContentUrl(), {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        },
        body: JSON.stringify(aiImproveInput)
    });
};
const getAiImproveContentMutationOptions = (options)=>{
    const mutationKey = [
        "aiImproveContent"
    ];
    const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
        ...options,
        mutation: {
            ...options.mutation,
            mutationKey
        }
    } : {
        mutation: {
            mutationKey
        },
        request: undefined
    };
    const mutationFn = (props)=>{
        const { data } = props ?? {};
        return aiImproveContent(data, requestOptions);
    };
    return {
        mutationFn,
        ...mutationOptions
    };
};
const useAiImproveContent = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(getAiImproveContentMutationOptions(options));
};
const getUploadImageUrl = ()=>{
    return `/api/upload`;
};
const uploadImage = async (uploadUrlInput, options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$custom$2d$fetch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customFetch"])(getUploadImageUrl(), {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        },
        body: JSON.stringify(uploadUrlInput)
    });
};
const getUploadImageMutationOptions = (options)=>{
    const mutationKey = [
        "uploadImage"
    ];
    const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
        ...options,
        mutation: {
            ...options.mutation,
            mutationKey
        }
    } : {
        mutation: {
            mutationKey
        },
        request: undefined
    };
    const mutationFn = (props)=>{
        const { data } = props ?? {};
        return uploadImage(data, requestOptions);
    };
    return {
        mutationFn,
        ...mutationOptions
    };
};
const useUploadImage = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(getUploadImageMutationOptions(options));
};
}),
"[project]/lib/api-client-react/dist/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$generated$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client-react/dist/generated/api.js [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/artifacts/matric-blog/src/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$10$2e$3_$40$supabase$2b$supabase$2d$js$40$2$2e$105$2e$4$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.10.3_@supabase+supabase-js@2.105.4/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$10$2e$3_$40$supabase$2b$supabase$2d$js$40$2$2e$105$2e$4$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "");
}
}),
"[project]/artifacts/matric-blog/src/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$20$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+query-core@5.90.20/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.1.0/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$matric$2d$blog$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/matric-blog/src/components/ui/tooltip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2d$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/api-client-react/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$matric$2d$blog$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/matric-blog/src/lib/supabase.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function Providers({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$20$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 60 * 2,
                    retry: 1
                }
            }
        }));
    // Initialize auth token getter
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$matric$2d$blog$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipProvider"], {
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
                    position: "top-center",
                    richColors: true
                }, void 0, false, {
                    fileName: "[project]/artifacts/matric-blog/src/app/providers.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/artifacts/matric-blog/src/app/providers.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/artifacts/matric-blog/src/app/providers.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0hhr7cs._.js.map