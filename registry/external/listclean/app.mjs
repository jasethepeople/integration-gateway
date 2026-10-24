import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "listclean",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.listclean.xyz/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "X-Auth-Token": this._apiKey(),
        },
        ...args,
      });
    },
    async verifyEmail({
      email, ...args
    }) {
      return this._makeRequest({
        path: `/verify/email/${email}`,
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "listclean");
