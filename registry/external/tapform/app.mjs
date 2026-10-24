import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "tapform",
  methods: {
    _apiUrl() {
      return "https://apimvp.tapform.io/api";
    },
    _getHeaders() {
      return {
        "tapform-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listLeads(args = {}) {
      return this._makeRequest({
        path: "leads/zapier-leads",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "tapform");
