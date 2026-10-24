import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "howuku",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.howuku.com/v1";
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
        headers: {
          "Authorization": `${this.$auth.api_key}`,
        },
      });
    },
    listSurveys(opts = {}) {
      return this._makeRequest({
        path: "/survey",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "howuku");
