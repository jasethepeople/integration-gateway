import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "labsmobile",
  methods: {
    _baseUrl() {
      return "https://api.labsmobile.com/json";
    },
    _auth() {
      return {
        username: this.$auth.email,
        password: this.$auth.api_token_or_password,
      };
    },
    _makeRequest({
      $ = this, path = "", ...otherOpts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          "Cache-Control": "no-cache",
        },
        auth: this._auth(),
        ...otherOpts,
      });
    },
    sendSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "labsmobile");
