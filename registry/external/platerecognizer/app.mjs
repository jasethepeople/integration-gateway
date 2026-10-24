import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "platerecognizer",
  methods: {
    _baseUrl() {
      return "https://api.platerecognizer.com/v1";
    },
    _headers(headers) {
      return {
        "Authorization": `Token ${this.$auth.api_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    runRecognition(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/plate-reader/",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "platerecognizer");
