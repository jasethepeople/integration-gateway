import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "vryno",
  methods: {
    _baseUrl() {
      return  `https://${this.$auth.company_instance_name}.ms.vryno.com`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    post(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/graphql/crm",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "vryno");
