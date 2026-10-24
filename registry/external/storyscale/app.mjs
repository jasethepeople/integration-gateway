import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "storyscale",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://prodapi.storyscale.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Accept": "application/json",
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    listTours(opts = {}) {
      return this._makeRequest({
        path: "/tour/show-all",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "storyscale");
