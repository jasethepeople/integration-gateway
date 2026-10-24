import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "ipinfo_io",
  propDefinitions: {},
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://ipinfo.io";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiToken()}`,
        },
        ...args,
      });
    },
    async lookupIP({
      ip, ...args
    }) {
      return this._makeRequest({
        path: `/${ip}`,
        ...args,
      });
    },
    async lookupASN({
      asn, ...args
    }) {
      return this._makeRequest({
        path: `/${asn}/json`,
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ipinfo_io");
