import { axios } from "../_platform-shim.mjs";
import languages from "./shared/common/languages.mjs";

const __pdApp = {
  type: "app",
  app: "weglot",
  propDefinitions: {
    language: {
      type: "string",
      label: "Language",
      description: "ISO 639-1 code of the language",
      async options() {
        return languages.map(({
          code: value, english_name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.weglot.com";
    },
    _authParams(params) {
      return {
        ...params,
        api_key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params = {},
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    translateText(args = {}) {
      return this._makeRequest({
        path: "/translate",
        method: "POST",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "weglot");
