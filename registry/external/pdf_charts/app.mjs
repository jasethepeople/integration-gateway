import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "pdf_charts",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.pdf-charts.com";
    },
    _auth(data) {
      return {
        ...data,
        apiKey: this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this,
      path,
      data,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: this._auth(data),
        ...args,
      });
    },
    createPdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/make/sync",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "pdf_charts");
