// commented by ingest: import ... from "@pipedream/procore";
const procore = {}; // stubbed by ingest: base module unavailable;
// commented by ingest: import ... from "@pipedream/procore/common/constants.mjs";
const constants = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...procore,
  app: "procore_sandbox",
  methods: {
    ...procore.methods,
    getEnvironment() {
      return constants.ENVIRONMENT.SANDBOX;
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "procore_sandbox");
