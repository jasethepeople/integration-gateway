import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "usersketch",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://app.usersketch.com/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "x-api-key": this._apiKey(),
        },
        ...args,
      });
    },
    async createEvent({ ...args } = {}) {
      return this._makeRequest({
        path: "/customer/event/create",
        method: "post",
        ...args,
      });
    },
    async createUser({ ...args } = {}) {
      return this._makeRequest({
        path: "/customer/create",
        method: "post",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "usersketch");
