import { axios } from "../_platform-shim.mjs";
import Bottleneck from "bottleneck";
const limiter = new Bottleneck({
  minTime: 200, // 5 requests per second
  maxConcurrent: 1,
});
const axiosRateLimiter = limiter.wrap(axios);

const __pdApp = {
  type: "app",
  app: "opensea",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.opensea.io/api/v2";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axiosRateLimiter($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-KEY": this.$auth.api_key,
        },
        ...otherOpts,
      });
    },
    retrieveEvents({
      collectionSlug, ...opts
    }) {
      return this._makeRequest({
        path: `/events/collection/${collectionSlug}`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "opensea");
