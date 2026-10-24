import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "change_photos",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://www.change.photos/api";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    transformImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/change",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "change_photos");
