import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "_21risk",
  methods: {
    _baseUrl() {
      return "https://www.21risk.com/odata/v5";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listActions(opts = {}) {
      return this._makeRequest({
        path: "/actions",
        ...opts,
      });
    },
    listAuditors(opts = {}) {
      return this._makeRequest({
        path: "/auditor",
        ...opts,
      });
    },
    listReports(opts = {}) {
      return this._makeRequest({
        path: "/reports",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "_21risk");
