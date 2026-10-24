import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "verifi_email",
  propDefinitions: {},
  methods: {
    validateEmailAddress({
      $ = this, params, ...opts
    }) {
      return axios($, {
        url: "https://api.verifi.email/check",
        params: {
          ...params,
          token: this.$auth.api_key,
        },
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "verifi_email");
