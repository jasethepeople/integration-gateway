// commented by ingest: import ... from "@pipedream/quickbooks";
const common = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...common,
  type: "app",
  app: "quickbooks_sandbox",
  methods: {
    ...common.methods,
    _apiUrl() {
      return "https://sandbox-quickbooks.api.intuit.com/v3";
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "quickbooks_sandbox");
