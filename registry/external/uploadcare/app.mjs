import { axios } from "../_platform-shim.mjs";
import qs from "qs";

const __pdApp = {
  type: "app",
  app: "uploadcare",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiSecret() {
      return this.$auth.api_secret;
    },
    _apiUrl(type) {
      return `https://${type}.uploadcare.com`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }, type = "api") {
      return axios($, {
        url: `${this._apiUrl(type)}${path}`,
        headers: {
          "Authorization": `Uploadcare.Simple ${this._apiKey()}:${this._apiSecret()}`,
        },
        ...args,
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/webhooks/",
        method: "post",
        ...args,
      });
    },
    async removeWebhook({ ...args }) {
      return this._makeRequest({
        path: "/webhooks/unsubscribe/",
        method: "delete",
        data: qs.stringify({
          ...args.data,
        }),
      });
    },
    async uploadFileFromURL({ ...args }) {
      return this._makeRequest({
        path: "/from_url/",
        method: "post",
        ...args,
        data: qs.stringify({
          pub_key: this._apiKey(),
          ...args.data,
        }),
      }, "upload");
    },
    async getFiles({ ...args }) {
      return this._makeRequest({
        path: "/files/",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "uploadcare");
