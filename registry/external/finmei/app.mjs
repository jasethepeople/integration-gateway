import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "finmei",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.finmei.com/api";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createInvoice(args) {
      return this._makeRequest({
        method: "POST",
        url: "/invoices",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "finmei");
