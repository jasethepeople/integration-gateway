import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "pingbell",
  propDefinitions: {
    pingbellId: {
      label: "Pingbell ID",
      description: "The Pingbell ID",
      type: "string",
      async options() {
        const pingbells = await this.getPingbells();

        return pingbells.map((pingbell) => ({
          label: pingbell.name,
          value: pingbell.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://app.pingbell.io";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          ...args.params,
          api_key: this._apiKey(),
        },
      });
    },
    async sendNotification(args = {}) {
      return this._makeRequest({
        path: "/log",
        method: "post",
        ...args,
      });
    },
    async getPingbells(args = {}) {
      return this._makeRequest({
        path: "/userPingbells",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "pingbell");
