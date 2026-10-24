// x-pd-ai: optimized
// commented by ingest: import ... from "@pipedream/ramp";
const ramp = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  type: "app",
  app: "ramp_sandbox",
  propDefinitions: {
    ...ramp.propDefinitions,
  },
  methods: {
    ...ramp.methods,
    _baseUrl() {
      return "https://demo-api.ramp.com/developer/v1";
    },
    _getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ramp_sandbox");
