// commented by ingest: import ... from "@pipedream/brex/common-app.mjs";
const commonApp = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...commonApp,
  type: "app",
  app: "brex_staging",
  methods: {
    ...commonApp.methods,
    _getBaseUrl() {
      return "https://platform.staging.brexapps.com";
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "brex_staging");
