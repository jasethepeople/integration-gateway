import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "niftykit",
  methods: {
    _baseUrl() {
      return "https://api.niftykit.com";
    },
    _headers() {
      return {
        "accept": "application/json",
        "x-api-key": `${this.$auth.api_access_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listTokens(args = {}) {
      return this._makeRequest({
        path: "/v3/collections/tokens",
        ...args,
      });
    },
    createMintLink(args = {}) {
      return this._makeRequest({
        path: "/onboarding/mintLinks",
        method: "POST",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "niftykit");
