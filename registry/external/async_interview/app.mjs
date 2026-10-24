import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "async_interview",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.asyncinterview.ai/api";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listInterviewResponses(opts = {}) {
      return this._makeRequest({
        path: "/interview_responses",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "async_interview");
