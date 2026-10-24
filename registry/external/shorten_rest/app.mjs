import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "shorten_rest",
  methods: {
    _baseUrl() {
      return "https://api.shorten.rest";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "x-api-key": this.$auth.api_key,
        },
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
__pdBind(__pdApp, "shorten_rest");
