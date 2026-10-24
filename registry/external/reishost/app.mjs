import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "reishost",
  propDefinitions: {
    command: {
      type: "string",
      label: "Command",
      description: "The command you want to execute on the server.",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.endpoint_structure}/api`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    sendCommand({
      serverId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/client/servers/${serverId}/command`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "reishost");
