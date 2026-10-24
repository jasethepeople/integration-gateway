import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "numverify",
  methods: {
    async _makeRequest({
      $ = this, params, ...args
    }) {
      return axios($, {
        baseURL: "http://apilayer.net/api",
        params: {
          ...params,
          access_key: `${this.$auth.api_key}`,
        },
        ...args,
      });
    },
    async validatePhone(args) {
      return this._makeRequest({
        url: "/validate",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "numverify");
