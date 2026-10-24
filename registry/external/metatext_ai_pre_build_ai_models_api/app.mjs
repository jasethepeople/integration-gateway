import { axios } from "../_platform-shim.mjs";
import constants from "./shared/common/constants.mjs";

const __pdApp = {
  type: "app",
  app: "metatext_ai_pre_build_ai_models_api",
  propDefinitions: {
    text: {
      type: "string",
      label: "Text",
      description: "The text parameter to be used as base for the request.",
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": this.$auth.api_key,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "metatext_ai_pre_build_ai_models_api");
