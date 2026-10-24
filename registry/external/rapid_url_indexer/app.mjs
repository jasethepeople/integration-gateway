import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "rapid_url_indexer",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The identifier of a project",
    },
  },
  methods: {
    _baseUrl() {
      return "https://rapidurlindexer.com/wp-json/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-Key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getProjectStatus({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        ...opts,
      });
    },
    downloadProjectReport({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/report`,
        ...opts,
      });
    },
    submitProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "rapid_url_indexer");
