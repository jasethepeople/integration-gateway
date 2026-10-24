import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "ncscale",
  methods: {
    _baseUrl() {
      return "https://logs.ncscale.io/v1";
    },
    _logKey() {
      return `${this.$auth.logs_token}`;
    },
    _headers() {
      return {
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, data = {},  ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        data: {
          ...data,
          token: this._logKey(),
        },
        ...opts,
      });
    },
    pushLog(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/logs",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ncscale");
