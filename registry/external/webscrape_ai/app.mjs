import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "webscrape_ai",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.webscrapeai.com";
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          apiKey: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    scrapeWebsite(opts = {}) {
      return this._makeRequest({
        path: "/scrapeWebSite",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "webscrape_ai");
