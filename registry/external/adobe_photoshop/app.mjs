import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "adobe_photoshop",
  methods: {
    _baseUrl() {
      return "https://image.adobe.io/sensei";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "x-api-key": `${this.$auth.client_id}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    removeBackground(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/cutout",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "adobe_photoshop");
