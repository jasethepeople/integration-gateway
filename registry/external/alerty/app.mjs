import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "alerty",
  methods: {
    _baseUrl() {
      return `${this.$auth.notification_url}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
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
__pdBind(__pdApp, "alerty");
