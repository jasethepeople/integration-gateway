import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "cloudbeds",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.cloudbeds.com/api/v1.3";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/${path}`,
        headers: {
          ...headers,
          "x-api-key": `${this.$auth.api_key}`,
          "accept": "application/json",
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/postWebhook",
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        path: "/deleteWebhook",
        method: "DELETE",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "cloudbeds");
