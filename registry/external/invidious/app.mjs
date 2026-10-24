import { axios } from "../_platform-shim.mjs";
import constants from "./shared/common/constants.mjs";

const __pdApp = {
  type: "app",
  app: "invidious",
  propDefinitions: {
    query: {
      type: "string",
      label: "Search Query",
      description: "The query to search for videos.",
    },
  },
  methods: {
    getUrl(path) {
      const { instance_url: instanceUrl } = this.$auth;
      const baseUrl = instanceUrl.endsWith("/")
        ? instanceUrl.slice(0, -1)
        : instanceUrl;
      return `${baseUrl}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.api_token}`,
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
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "invidious");
