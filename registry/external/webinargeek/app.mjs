import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "webinargeek",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://app.webinargeek.com/api/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Api-Token": this._apiKey(),
        },
        ...args,
      });
    },
    async getSubscriptions({ ...args } = {}) {
      const response = await this._makeRequest({
        path: "/subscriptions",
        ...args,
      });

      return response.subscriptions;
    },
    async getPayments({ ...args } = {}) {
      const response = await this._makeRequest({
        path: "/subscription_payments",
        ...args,
      });

      return response.subscription_payments;
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "webinargeek");
