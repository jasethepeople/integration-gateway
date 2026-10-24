import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "calendarhero",
  propDefinitions: {},
  methods: {
    async _makeRequest({
      $ = this, headers, ...args
    } = {}) {
      return axios($, {
        baseURL: "https://api.calendarhero.com",
        headers: {
          ...headers,
          Authorization: `${this.$auth.api_key}`,
        },
        ...args,
      });
    },
    listMeetings(args) {
      return this._makeRequest({
        url: "/meeting",
        ...args,
      });
    },
    listMeetingTypes(args) {
      return this._makeRequest({
        url: "/user/meeting",
        ...args,
      });
    },
    createWebhook({
      event, ...args
    }) {
      return this._makeRequest({
        method: "post",
        url: `webhook/${event}`,
        ...args,
      });
    },
    deleteWebhook({
      event, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        url: `webhook/${event}`,
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "calendarhero");
