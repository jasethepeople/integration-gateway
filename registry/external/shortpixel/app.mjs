import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "shortpixel",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://cdn.shortpixel.ai";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: this.$auth.api_key,
        },
        ...opts,
      });
    },
    optimizeImage({
      params, url, ...opts
    }) {
      return this._makeRequest({
        path: `/client/${params}/${url}`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "shortpixel");
