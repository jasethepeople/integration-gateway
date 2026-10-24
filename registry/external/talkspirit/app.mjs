import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "talkspirit",
  methods: {
    _token() {
      return this.$auth.api_key;
    },
    async sendIncomingWebhook({
      $ = this, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: `https://webhook.talkspirit.com/v1/incoming/${this._token()}`,
        headers: {
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "talkspirit");
