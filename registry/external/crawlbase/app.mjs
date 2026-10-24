import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "crawlbase",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.crawlbase.com";
    },
    makeRequest({
      $ = this, path = "", params = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          token: `${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "crawlbase");
