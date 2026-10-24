import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "easyly",
  methods: {
    _baseUrl() {
      return "https://api.easyly.com";
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        url: this._baseUrl() + path,
        headers: this.getHeaders(headers),
        ...args,
      };
      return axios($, config);
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
__pdBind(__pdApp, "easyly");
