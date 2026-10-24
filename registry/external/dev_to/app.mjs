import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "dev_to",
  methods: {
    _getBaseUrl() {
      return "https://dev.to/api";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "api-key": `${this.$auth.api_key}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    async _makeRequest(ctx = this, opts) {
      return axios(ctx, this._getAxiosParams(opts));
    },
    getArticles(ctx = this, { params }) {
      return this._makeRequest(ctx, {
        path: "/api/articles",
        params,
      });
    },
    getMyArticles(ctx = this, { params }) {
      return this._makeRequest(ctx, {
        path: "/articles/me/published",
        params,
      });
    },
    getReadingList(ctx = this, { params }) {
      return this._makeRequest(ctx, {
        path: "/readinglist",
        params,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "dev_to");
