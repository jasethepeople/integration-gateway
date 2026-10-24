import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "ip2geo",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.ip2geo.dev";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "X-Api-Key": this._apiKey(),
        },
        ...args,
      });
    },
    async lookupIP({
      ip, ...args
    }) {
      return this._makeRequest({
        path: "/convert",
        params: {
          ip,
        },
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ip2geo");
