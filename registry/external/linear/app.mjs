// commented by ingest: import ... from "@pipedream/linear_app";
const linearApp = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...linearApp,
  app: "linear",
  methods: {
    ...linearApp.methods,
    getClientOptions(options = {}) {
      return {
        accessToken: this.$auth.oauth_access_token,
        ...options,
      };
    },
    getAxiosHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "linear");
