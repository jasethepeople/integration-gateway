import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "interzoid",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.interzoid.com";
    },
    _authParams(authType = "license", params) {
      return authType === "license"
        ? {
          ...params,
          license: `${this.$auth.api_key}`,
        }
        : {
          ...params,
          apikey: `${this.$auth.api_key}`,
        };
    },
    _makeRequest({
      $ = this,
      path,
      params,
      authType,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(authType, params),
        ...opts,
      });
    },
    getFullNameMatch(opts = {}) {
      return this._makeRequest({
        path: "/getfullnamematchscore",
        ...opts,
      });
    },
    getOrgMatch(opts = {}) {
      return this._makeRequest({
        path: "/getorgmatchscore",
        ...opts,
      });
    },
    generateMatchReport({
      params, ...opts
    }) {
      return this._makeRequest({
        url: "https://connect.interzoid.com/run",
        authType: "apikey",
        params: {
          ...params,
          function: "match",
          process: "matchreport",
          json: true,
        },
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "interzoid");
