// commented by ingest: import ... from "@pipedream/launchdarkly";
const launchdarkly = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...launchdarkly,
  type: "app",
  app: "launch_darkly_oauth",
  methods: {
    ...launchdarkly.methods,
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "launch_darkly_oauth");
