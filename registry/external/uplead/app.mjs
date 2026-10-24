import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "uplead",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.uplead.com/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "Authorization": this._apiKey(),
        },
      });
    },
    async getContactByEmail(args = {}) {
      return this._makeRequest({
        path: "/person-search",
        ...args,
      });
    },
    async getCompanyByDomain(args = {}) {
      return this._makeRequest({
        path: "/company-search",
        method: "post",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "uplead");
