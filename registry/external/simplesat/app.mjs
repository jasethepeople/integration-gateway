import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "simplesat",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.simplesat.io/api";
    },
    _getHeaders() {
      const res = {
        "Content-Type": "application/json",
        "X-Simplesat-Token": this.$auth.api_key,
      };
      return res;
    },
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    listAnswers(page, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "/answers",
        params: {
          page,
        },
      }));
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "simplesat");
