import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "heedjy",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.heedjy.com/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        url,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: url || `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listApps(opts = {}) {
      return this._makeRequest({
        path: "/apps",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "heedjy");
