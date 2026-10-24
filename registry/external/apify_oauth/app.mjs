// commented by ingest: import ... from "@pipedream/apify";
const common = {}; // stubbed by ingest: base module unavailable;
import { ApifyClient } from "apify-client";

const __pdApp = {
  type: "app",
  app: "apify_oauth",
  propDefinitions: {
    ...common.propDefinitions,
  },
  methods: {
    ...common.methods,
    getAuthToken() {
      return this.$auth.oauth_access_token;
    },
    _client() {
      return new ApifyClient({
        token: this.getAuthToken(),
        requestInterceptors: [
          (config) => ({
            ...config,
            headers: {
              ...(config.headers || {}),
              "x-apify-integration-platform": "pipedream",
            },
          }),
        ],
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "apify_oauth");
