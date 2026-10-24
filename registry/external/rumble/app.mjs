import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "rumble",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://rumble.com/-livestream-api";
    },
    _makeRequest({
      $ = this,
      path,
      params = {},
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: this.$auth.live_streaming_api_key,
        },
        ...opts,
      });
    },
    getData(opts = {}) {
      return this._makeRequest({
        path: "/get-data",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "rumble");
