import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "scraptio",
  methods: {
    _baseUrl() {
      return "https://api.scraptio.com";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
      };
    },
    _auth() {
      return {
        "api_key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        data: {
          ...data,
          ...this._auth(),
        },
        ...opts,
      });
    },
    scrape(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/scrape",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "scraptio");
