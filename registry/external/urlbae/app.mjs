import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "urlbae",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://urlbae.com/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async createQrcode(args = {}) {
      return this._makeRequest({
        path: "/qr/add",
        method: "post",
        ...args,
      });
    },
    async shortenUrl(args = {}) {
      return this._makeRequest({
        path: "/url/add",
        method: "post",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "urlbae");
