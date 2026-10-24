import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "membado",
  propDefinitions: {},
  methods: {
    _baseRequest({
      $, data, headers, ...args
    }) {
      return axios($, {
        baseURL: `https://www.membado.io/api/${this.$auth.user_identifier}`,
        data: {
          ...data,
          apikey: this.$auth.api_key,
        },
        headers: {
          ...headers,
          "content-type": "application/x-www-form-urlencoded",
        },
        ...args,
      });
    },
    addMember(args) {
      return this._baseRequest({
        method: "POST",
        url: "/add-member",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "membado");
