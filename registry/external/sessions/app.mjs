import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "sessions",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The unique identifier for a session.",
      async options({ page }) {
        const { data } = await this.listSessions({
          params: {
            page,
          },
        });

        return data.map((session) => ({
          label: session.name,
          value: session.id,
        }));
      },
    },
    endedAt: {
      type: "string",
      label: "Ended At",
      description: "The timestamp when the session ended (in ISO 8601 format).",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.app.sessions.us/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async getSessions(args = {}) {
      return this._makeRequest({
        path: "/sessions",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "sessions");
