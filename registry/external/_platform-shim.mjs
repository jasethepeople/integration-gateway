// _platform-shim.mjs — drop-in replacement for `@pipedream/platform`'s `axios`.
// Pure-JS axios-compatible client backed by global fetch (which the gateway's
// RuntimeContext provides as ctx.http). Generated once by scripts/ingest.mjs.
//
// Supported surface (covers the overwhelming majority of upstream usage):
//   axios($, config)                 -> Promise<{status,statusText,headers,data}>
//   axios(config)                    -> same, when called without the pipedream `$`
//   axios.get/post/put/patch/delete/head/options(url[, config])
//   axios.create(defaultConfig)
// Behavior mirrors axios: resolves on 2xx, rejects with err.response otherwise,
// auto-JSON request/response bodies, query `params`, timeout via AbortController.

function buildUrl(url, params) {
  if (!params || typeof params !== "object") return url;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) v.forEach((x) => usp.append(k, String(x)));
    else usp.append(k, String(v));
  }
  const qs = usp.toString();
  if (!qs) return url;
  return url + (url.includes("?") ? "&" : "?") + qs;
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" &&
    (v.constructor === Object || v.constructor === undefined);
}

class AxiosError extends Error {
  constructor(message, config, response) {
    super(message);
    this.name = "AxiosError";
    this.config = config;
    this.response = response;
    if (response) this.status = response.status;
  }
}

async function coreRequest(config) {
  const cfg = { method: "GET", ...(config || {}) };
  const url = buildUrl(cfg.url, cfg.params);
  if (!url) throw new AxiosError("axios shim: config.url is required", cfg);
  const headers = { ...(cfg.headers || {}) };
  let body = cfg.body;
  if (body === undefined && cfg.data !== undefined) {
    const d = cfg.data;
    if (typeof d === "string" || d instanceof URLSearchParams ||
        (typeof FormData !== "undefined" && d instanceof FormData) ||
        (typeof Buffer !== "undefined" && Buffer.isBuffer(d))) {
      body = d;
    } else {
      body = JSON.stringify(d);
      if (!Object.keys(headers).some((h) => h.toLowerCase() === "content-type")) {
        headers["Content-Type"] = "application/json";
      }
    }
  }
  let signal = cfg.signal;
  let timer;
  if (cfg.timeout && !signal && typeof AbortController !== "undefined") {
    const ac = new AbortController();
    signal = ac.signal;
    timer = setTimeout(() => ac.abort(), cfg.timeout);
  }
  const fetchImpl = coreRequest.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new AxiosError("axios shim: no fetch implementation available", cfg);
  }
  let res;
  try {
    res = await fetchImpl(url, {
      method: (cfg.method || "GET").toUpperCase(),
      headers,
      body,
      signal,
      redirect: cfg.maxRedirects === 0 ? "manual" : "follow",
    });
  } catch (e) {
    throw new AxiosError(`axios shim: request failed: ${e.message}`, cfg);
  } finally {
    if (timer) clearTimeout(timer);
  }
  const hdrs = {};
  if (res.headers && typeof res.headers.forEach === "function") {
    res.headers.forEach((v, k) => { hdrs[k] = v; });
  }
  const text = await res.text();
  let data = text;
  const ct = (hdrs["content-type"] || "").toLowerCase();
  if (text && (cfg.responseType === "json" || ct.includes("json") ||
      /^[\[{]/.test(text.trim()))) {
    try { data = JSON.parse(text); } catch { /* keep raw text */ }
  }
  const out = {
    status: res.status,
    statusText: res.statusText,
    headers: hdrs,
    data,
    config: cfg,
  };
  if (!res.ok) {
    throw new AxiosError(`Request failed with status code ${res.status}`, cfg, out);
  }
  return out;
}

/**
 * axios($, config) — Pipedream platform signature. If the first argument looks
 * like a config object (has `url`), it's treated as axios(config).
 */
export function axios($, config) {
  let cfg;
  if (config === undefined && ($ === null || isPlainObject($)) &&
      ($ === null || $.url !== undefined || $.baseURL !== undefined)) {
    cfg = $ || {};
  } else if (typeof $ === "string") {
    cfg = { ...(config || {}), url: $ };
  } else {
    cfg = config || {};
  }
  if (cfg.baseURL && cfg.url && !/^https?:\/\//i.test(cfg.url)) {
    cfg = { ...cfg, url: cfg.baseURL.replace(/\/$/, "") + "/" + String(cfg.url).replace(/^\//, "") };
  }
  return coreRequest(cfg);
}

for (const m of ["get", "delete", "head", "options"]) {
  axios[m] = (url, config = {}) => axios({ ...config, url, method: m.toUpperCase() });
}
for (const m of ["post", "put", "patch"]) {
  axios[m] = (url, data, config = {}) =>
    axios({ ...config, url, data, method: m.toUpperCase() });
}
axios.create = (defaults = {}) => {
  const inst = ($, config) => {
    let cfg;
    if (config === undefined && isPlainObject($) && $.url !== undefined) cfg = $;
    else if (typeof $ === "string") cfg = { ...(config || {}), url: $ };
    else cfg = config || {};
    return axios({
      ...defaults,
      ...cfg,
      headers: { ...(defaults.headers || {}), ...(cfg.headers || {}) },
    });
  };
  for (const m of ["get", "delete", "head", "options"]) {
    inst[m] = (url, config = {}) => inst({ ...config, url, method: m.toUpperCase() });
  }
  for (const m of ["post", "put", "patch"]) {
    inst[m] = (url, data, config = {}) => inst({ ...config, url, data, method: m.toUpperCase() });
  }
  return inst;
};
axios.AxiosError = AxiosError;
axios.isAxiosError = (e) => e instanceof AxiosError || (e && e.isAxiosError === true);

/** Allow tests/gateway to inject the RuntimeContext fetch. */
export function __pdSetFetch(fetchImpl) {
  coreRequest.fetchImpl = fetchImpl;
}

/**
 * Binds `$auth` (and `<appName>$auth`) getters onto an upstream app-module
 * default export so its methods (`this.$auth.oauth_access_token`, ...) read the
 * auth of the currently executing RuntimeContext, set by _pipedream-shim.
 */
export function __pdBindAuth(appObj, appName) {
  const getAuth = () => globalThis.__PD_AUTH__ || {};
  for (const key of ["$auth", appName ? `${appName}$auth` : null].filter(Boolean)) {
    try {
      Object.defineProperty(appObj, key, { get: getAuth, configurable: true });
    } catch { /* non-configurable — skip */ }
  }
  return appObj;
}

export default axios;

// ---------------------------------------------------------------------------
// Additional @pipedream/platform named exports used by upstream components.
// Appended during registry recovery (stage-4 validation findings).
// ---------------------------------------------------------------------------

/** Matches @pipedream/platform ConfigurationError surface. */
export class ConfigurationError extends Error {
  constructor(message, exposeStack) {
    super(message);
    this.name = "ConfigurationError";
    if (exposeStack === false) this.stack = undefined;
  }
}

/** Default polling interval for timer sources (15 minutes, as upstream). */
export const DEFAULT_POLLING_SOURCE_TIMER_INTERVAL = 60 * 15;

async function streamFromUrl(url, fetchOpts) {
  const fetchImpl = coreRequest.fetchImpl || globalThis.fetch;
  const res = await fetchImpl(url, fetchOpts);
  if (!res.ok) {
    throw new Error(`getFileStream failed: HTTP ${res.status} ${res.statusText}`);
  }
  // Prefer a Node Readable when available (upstream returns a Readable).
  if (res.body && typeof res.body.getReader === "function") {
    try {
      const { Readable } = await import("node:stream");
      return Readable.fromWeb(res.body);
    } catch { /* fall through */ }
  }
  return res.body;
}

/** fetch a remote file and return a readable stream of its bytes. */
export async function getFileStream(urlOrOpts, fetchOpts) {
  const url = typeof urlOrOpts === "string" ? urlOrOpts : urlOrOpts?.url;
  if (!url) throw new Error("getFileStream: url is required");
  return streamFromUrl(url, fetchOpts ?? urlOrOpts?.fetchOpts);
}

/** like getFileStream, plus basic metadata (contentType, contentLength). */
export async function getFileStreamAndMetadata(urlOrOpts, fetchOpts) {
  const url = typeof urlOrOpts === "string" ? urlOrOpts : urlOrOpts?.url;
  if (!url) throw new Error("getFileStreamAndMetadata: url is required");
  const fetchImpl = coreRequest.fetchImpl || globalThis.fetch;
  const res = await fetchImpl(url, fetchOpts ?? urlOrOpts?.fetchOpts);
  if (!res.ok) {
    throw new Error(`getFileStreamAndMetadata failed: HTTP ${res.status} ${res.statusText}`);
  }
  let stream = res.body;
  if (stream && typeof stream.getReader === "function") {
    try {
      const { Readable } = await import("node:stream");
      stream = Readable.fromWeb(res.body);
    } catch { /* keep web stream */ }
  }
  const len = res.headers?.get?.("content-length");
  return {
    stream,
    contentType: res.headers?.get?.("content-type") ?? undefined,
    contentLength: len != null ? Number(len) : undefined,
  };
}
