import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "leadboxer",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.leadboxer.com/v1";
    },
    _makeRequest({
      $ = this, path, params = {}, opts = {},
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": this.$auth.api_key,
        },
        params: {
          ...params,
          site: this.$auth.dataset_id,
        },
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "leadboxer");
