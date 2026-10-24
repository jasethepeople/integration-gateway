import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "updown_io",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://updown.io/api";
    },
    _authParams(params) {
      return {
        ...params,
        "api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
      });
    },
    createRecipient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/recipients",
        ...opts,
      });
    },
    deleteRecipient({
      recipientId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/recipients/${recipientId}`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "updown_io");
