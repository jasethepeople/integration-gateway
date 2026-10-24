import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "fileforge",
  methods: {
    _baseUrl() {
      return "https://api.fileforge.com";
    },
    _headers(headers = {}) {
      return {
        "X-API-Key": this.$auth.api_key,
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
    generatePDF(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pdf/generate/",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "fileforge");
