import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "gumroad",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.gumroad.com/v2";
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
    async getProducts(args = {}) {
      return this._makeRequest({
        path: "/products",
        ...args,
      });
    },
    async getSales(args = {}) {
      return this._makeRequest({
        path: "/sales",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "gumroad");
