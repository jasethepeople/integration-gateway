import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "ntfy",
  methods: {
    getUrl(path) {
      return `${this.$auth.server}${path}`;
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ntfy");
