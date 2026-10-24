import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "eventee",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.eventee.com/public/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    listParticipants(opts = {}) {
      return this._makeRequest({
        path: "/participants",
        ...opts,
      });
    },
    listRegistrations(opts = {}) {
      return this._makeRequest({
        path: "/registrations",
        ...opts,
      });
    },
    inviteAttendees(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/attendee/invite",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "eventee");
