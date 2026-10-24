import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "chargeblast",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your Chargeblast API Key",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chargeblast.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...headers,
          api_key: this.$auth.api_key,
        },
      });
    },
    async getAlerts(args = {}) {
      return this._makeRequest({
        path: "/alerts",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "chargeblast");
