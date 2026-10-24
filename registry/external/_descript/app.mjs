import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "_descript",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://descriptapi.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    getPublishedProjectMetadata(opts = {}) {
      return this._makeRequest({
        path: `/published_projects/${this.$auth.published_project_slug}`,
        ...opts,
      });
    },
    createImportUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/edit_in_descript/schema",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "_descript");
