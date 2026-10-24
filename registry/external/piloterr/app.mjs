import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "piloterr",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://piloterr.com/api/v2";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    getWebsiteTechnology(opts = {}) {
      return this._makeRequest({
        path: "/website/technology",
        ...opts,
      });
    },
    getCompanyData(opts = {}) {
      return this._makeRequest({
        path: "/company",
        ...opts,
      });
    },
    scrapeWebsite(opts = {}) {
      return this._makeRequest({
        path: "/website/crawler",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "piloterr");
