import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "ringover",
  propDefinitions: {
    number: {
      type: "integer",
      label: "Number",
      description: "International number format (E.164)",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.server}.ringover.com/v2`;
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `${this.$auth.api_key}`,
          "Accept": "application/json",
        },
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ringover");
