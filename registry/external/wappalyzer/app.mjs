import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "wappalyzer",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.wappalyzer.com/v2";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getTechnologies(args = {}) {
      return this._makeRequest({
        path: "/lookup",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "wappalyzer");
