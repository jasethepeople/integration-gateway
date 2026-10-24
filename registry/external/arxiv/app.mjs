import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "arxiv",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://export.arxiv.org/api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...opts,
      });
    },
    search(opts = {}) {
      return this._makeRequest({
        path: "/query",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "arxiv");
