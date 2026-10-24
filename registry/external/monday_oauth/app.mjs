import { ApiClient } from "@mondaydotcomorg/api";
// commented by ingest: import ... from "@pipedream/monday";
const common = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...common,
  app: "monday_oauth",
  methods: {
    ...common.methods,
    _client() {
      return new ApiClient({
        token: this.$auth.oauth_access_token,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "monday_oauth");
