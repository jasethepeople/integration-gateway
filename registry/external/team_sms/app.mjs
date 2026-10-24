import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "team_sms",
  methods: {
    _baseUrl() {
      return "https://teamsms.io/api";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-KEY": this.$auth.api_key,
          "Accept": "application/json",
        },
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "team_sms");
