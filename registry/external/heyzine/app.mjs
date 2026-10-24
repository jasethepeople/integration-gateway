import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "heyzine",
  methods: {
    _baseUrl() {
      return "https://heyzine.com/api1/rest";
    },
    makeRequest(opts = {}) {
      const {
        $ = this,
        params = {},
        ...otherOpts
      } = opts; console.log(params);
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        params: {
          ...params,
          "k": `${this.$auth.api_key}`,
        },
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "heyzine");
