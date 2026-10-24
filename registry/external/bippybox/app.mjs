import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "bippybox",
  methods: {
    getUrl(path) {
      return `https://websocket.bippybox.io${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    activateBox({
      data, ...args
    } = {}) {
      const { uid } = this.$auth;
      return this.post({
        path: "/send",
        data: {
          ...data,
          uid,
        },
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "bippybox");
