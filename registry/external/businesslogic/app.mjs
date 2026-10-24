import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "businesslogic",
  methods: {
    _baseUrl() {
      return "https://api.businesslogic.online";
    },
    _headers() {
      return {
        "X-Auth-Token": `${this.$auth.live_token}`,
      };
    },
    async _makeRequest({
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
    describeEndpoint(args = {}) {
      return this._makeRequest({
        path: "/describe",
        ...args,
      });
    },
    executeEndpoint(args = {}) {
      return this._makeRequest({
        path: "/execute",
        method: "POST",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "businesslogic");
