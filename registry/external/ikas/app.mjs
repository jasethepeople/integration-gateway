import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "ikas",
  methods: {
    _baseUrl() {
      return "https://api.myikas.com/api/v1/admin/graphql";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    makeRequest({
      $ = this, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl(),
        headers: this._headers(),
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ikas");
