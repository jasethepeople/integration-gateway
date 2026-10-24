import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "onstrategy",
  methods: {
    _baseUrl() {
      return "https://api.onstrategyhq.com/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: `${this.$auth.api_key}`,
        },
      });
    },
    listGoals(opts = {}) {
      return this._makeRequest({
        path: "/goals.json",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "onstrategy");
