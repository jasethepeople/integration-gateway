import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "printful_oauth",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.printful.com";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/webhooks",
        method: "post",
        ...args,
      });
    },
    async removeWebhook() {
      return this._makeRequest({
        path: "/webhooks",
        method: "delete",
      });
    },
    async getOrders({ ...args }) {
      const response = await this._makeRequest({
        path: "/orders",
        ...args,
      });

      return response.result;
    },
    async createOrder({ ...args }) {
      return this._makeRequest({
        path: "/orders",
        method: "post",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "printful_oauth");
