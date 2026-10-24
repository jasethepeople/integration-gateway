import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "unstructured",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return this.$auth.url;
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "unstructured-api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    extractFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/general/v0/general",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "unstructured");
