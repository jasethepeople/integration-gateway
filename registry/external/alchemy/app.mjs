import { axios } from "../_platform-shim.mjs";
import constants from "./shared/common/constants.mjs";

const __pdApp = {
  type: "app",
  app: "alchemy",
  propDefinitions: {
    network: {
      type: "string",
      label: "Network",
      description: "Network of the webhook",
      options: constants.NETWORKS,
    },
    query: {
      type: "string",
      label: "GraphQL Query",
      description: "Create a custom GraphQL query or select `Full Block Receipts` to get all log events for every new block",
      options: [
        {
          label: "Full Block Receipts",
          value: constants.FULL_BLOCK_RECEIPTS,
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://dashboard.alchemy.com/api";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-Alchemy-Token": this.$auth.auth_token,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create-webhook",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/delete-webhook",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "alchemy");
