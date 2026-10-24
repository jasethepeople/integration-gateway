import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "fixer_io",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://data.fixer.io/api";
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Accept: "application/json",
        },
        params: {
          ...params,
          access_key: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    convertCurrency(opts = {}) {
      return this._makeRequest({
        path: "/convert",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "fixer_io");
