import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "jina_reader",
  methods: {
    getUrl() {
      return "https://r.jina.ai/";
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "jina_reader");
