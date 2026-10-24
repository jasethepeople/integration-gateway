import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "prospeo",
  methods: {
    _baseUrl() {
      return "https://api.prospeo.io";
    },
    _headers() {
      return {
        "x-key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
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
    findEmail(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/email-finder",
        ...args,
      });
    },
    findMobile(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/mobile-finder",
        ...args,
      });
    },
    extractData(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/social-url-enrichment",
        ...args,
      });
    },
    searchDomain(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/domain-search",
        ...args,
      });
    },
    verifyEmail(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/email-verifier",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "prospeo");
