import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "dhl",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return this.$auth.api_url;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "dhl-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getTracking(opts = {}) {
      return this._makeRequest({
        path: "/track/shipments",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "dhl");
