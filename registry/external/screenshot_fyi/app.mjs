import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "screenshot_fyi",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://screenshot.fyi/api";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          accessKey: this.$auth.access_key,
        },
        ...otherOpts,
      });
    },
    takeScreenshot(opts = {}) {
      return this._makeRequest({
        path: "/take",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "screenshot_fyi");
