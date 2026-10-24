import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "cyfe",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.cyfe.com/api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    pushValue({
      widgetId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/push/${widgetId}`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "cyfe");
