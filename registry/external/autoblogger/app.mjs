import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "autoblogger",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://autoblogger-api.otherweb.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": `${this.$auth.api_key}`,
          "Accept": "application/json",
        },
      });
    },
    async validateKey(args = {}) {
      return this._makeRequest({
        path: "/api/v1/site/validate/apikey",
        ...args,
      });
    },
    async getBlogposts(args = {}) {
      return this._makeRequest({
        path: "/api/v1/blogposts",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "autoblogger");
