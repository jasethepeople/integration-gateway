import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "fomo",
  propDefinitions: {},
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.fomo.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Token ${this._apiToken()}`,
        },
        ...args,
      });
    },
    async createEvent(args = {}) {
      return this._makeRequest({
        path: "/applications/me/events",
        method: "post",
        ...args,
      });
    },
    async getEvents(args = {}) {
      return this._makeRequest({
        path: "/applications/me/events",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "fomo");
