import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "social_intents",
  propDefinitions: {},
  methods: {
    _accountId() {
      return this.$auth.account_id;
    },
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.socialintents.com/v1/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._accountId(),
          password: this._apiToken(),
        },
        ...args,
      });
    },
    async getChats(args = {}) {
      return this._makeRequest({
        path: "/chats",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "social_intents");
