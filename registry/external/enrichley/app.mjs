import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "enrichley",
  methods: {
    _baseUrl() {
      return "https://api.enrichley.io/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Accept": "application/json",
          "X-API-Key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    validateEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/validate-single-email",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "enrichley");
