import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "dhl_parcel",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api-gw.dhlparcel.nl";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...opts,
      });
    },
    trackAndTrace(opts = {}) {
      return this._makeRequest({
        path: "/track-trace",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "dhl_parcel");
