import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "imgbb",
  propDefinitions: {},
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://api.imgbb.com/1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        params: {
          ...opts.params,
          key: this._getApiKey(),
        },
      };
      return res;
    },
    uploadPicture(ctx = this, data) {
      return axios(ctx, this._getAxiosParams({
        method: "post",
        path: "/upload",
        data,
      }));
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "imgbb");
