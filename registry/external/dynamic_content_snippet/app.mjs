import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "dynamic_content_snippet",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.contentsnip.com/api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    createOrUpdateWebsiteContent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/mappings",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "dynamic_content_snippet");
