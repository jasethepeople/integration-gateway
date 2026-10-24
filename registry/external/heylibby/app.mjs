import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "heylibby",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://3wsq3v2kgg.execute-api.us-east-1.amazonaws.com/prod/zapier/trigger";
    },
    _makeRequest({
      $ = this, params = {}, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(),
        params: {
          ...params,
          zapierAPI: this.$auth.api_key,
        },
        ...opts,
      });
    },
    listQualifiedLeads(opts = {}) {
      return this._makeRequest(opts);
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "heylibby");
