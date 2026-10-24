import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "picky_assist",
  propDefinitions: {},
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://pickyassist.com/app/api/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        data: {
          ...args.data,
          token: this._apiToken(),
        },
      });
    },
    async sendMessage(args = {}) {
      return this._makeRequest({
        path: "/push",
        method: "post",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "picky_assist");
