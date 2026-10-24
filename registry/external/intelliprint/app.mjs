import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "intelliprint",
  propDefinitions: {},
  methods: {
    _apiUrl() {
      return "https://api.rnbdata.uk/v1";
    },
    _getAuth() {
      return {
        "username": this.$auth.api_key,
        "password": "",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        auth: this._getAuth(),
        ...opts,
      });
    },
    createPrintJob(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "prints",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "intelliprint");
