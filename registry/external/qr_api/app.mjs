import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "qr_api",
  methods: {
    _baseUrl() {
      return "https://qrapi.io/v2";
    },
    _params(params = {}) {
      return {
        api_key: this.$auth.api_key,
        ...params,
      };
    },
    _makeRequest({
      $ = this, path, params = {}, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    createQrcode({
      type, ...opts
    }) {
      return this._makeRequest({
        path: `/qrcode/${type}`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "qr_api");
