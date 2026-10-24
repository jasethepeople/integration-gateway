import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "gozen_growth",
  methods: {
    _baseUrl() {
      return `${this.$auth.webhook_url}`;
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.authentication_token}`,
      };
    },
    _makeRequest({
      $ = this, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(),
        headers: this._headers(),
        ...opts,
      });
    },
    async createOrUpdateContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "gozen_growth");
