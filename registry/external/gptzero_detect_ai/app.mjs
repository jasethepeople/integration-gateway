import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "gptzero_detect_ai",
  methods: {
    _baseUrl() {
      return "https://api.gptzero.me/v2/predict";
    },
    _headers(headers = {}) {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-api-key": `${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    detectFiles(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/files",
        ...opts,
      });
    },
    detectText(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/text",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "gptzero_detect_ai");
