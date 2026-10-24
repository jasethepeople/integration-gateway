import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "jvzoo",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.jvzoo.com/v2.0";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_key}`,
          password: "x",
        },
        headers: {
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    getLatestTransactions({
      paykey, ...opts
    }) {
      return this._makeRequest({
        path: `/latest-transactions/${paykey}`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "jvzoo");
