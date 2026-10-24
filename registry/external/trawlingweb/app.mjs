import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "trawlingweb",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.trawlingweb.com";
    },
    _makeRequest({
      $ = this, params = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}`,
        params: {
          ...params,
          token: `${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    searchNews(opts = {}) {
      return this._makeRequest({
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "trawlingweb");
