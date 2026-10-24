import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "spider",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.spider.cloud";
    },
    async _makeRequest({
      $ = this, path = "/", headers, ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async initiateCrawl(args) {
      return this._makeRequest({
        method: "POST",
        path: "/crawl",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "spider");
