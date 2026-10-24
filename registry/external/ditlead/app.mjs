import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "ditlead",
  propDefinitions: {},
  methods: {
    _makeRequest({
      $, headers, ...args
    }) {
      return axios($, {
        baseURL: "https://api.ditlead.com/v1",
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...args,
      });
    },
    createWebhook(args) {
      return this._makeRequest({
        method: "POST",
        url: "/webhook",
        ...args,
      });
    },
    deleteWebhook(args) {
      return this._makeRequest({
        method: "DELETE",
        url: "/webhook",
        ...args,
      });
    },
    listCampaigns(args) {
      return this._makeRequest({
        url: "/campaign",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ditlead");
