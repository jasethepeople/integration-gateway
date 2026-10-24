import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "getemails",
  propDefinitions: {},
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://api.getemail.io/v2";
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        params: {
          api_key: this._getApiKey(),
          ...opts.params,
        },
      };
      return axios(ctx, axiosOpts);
    },
    async findEmail(params, ctx = this) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/find-email",
        params,
      }, ctx);
    },
    async statusFindEmail(id, ctx = this) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/status-find-email",
        params: {
          id,
        },
      }, ctx);
    },
    async verifyEmail(email, ctx = this) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/verif-email",
        params: {
          email,
        },
      }, ctx);
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "getemails");
