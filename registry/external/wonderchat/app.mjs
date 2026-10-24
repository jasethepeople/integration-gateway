import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "wonderchat",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.wonderchat.io/api/v1";
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        data: {
          ...data,
          apiKey: this.$auth.api_key,
        },
        ...opts,
      });
    },
    chat(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "wonderchat");
