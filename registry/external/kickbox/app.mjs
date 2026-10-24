import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "kickbox",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.kickbox.com/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          ...args.params,
          "apikey": this._apiKey(),
        },
      });
    },
    async verifyEmail(args = {}) {
      return this._makeRequest({
        path: "/verify",
        ...args,
      });
    },
    async verifyEmailBatch(args = {}) {
      return this._makeRequest({
        path: "/verify-batch",
        method: "put",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "kickbox");
