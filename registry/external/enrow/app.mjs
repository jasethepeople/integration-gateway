import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "enrow",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.enrow.io";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    getResult(opts = {}) {
      return this._makeRequest({
        path: "/email/find/single",
        ...opts,
      });
    },
    executeSearch(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/email/find/single",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "enrow");
