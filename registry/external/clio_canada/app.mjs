// commented by ingest: import ... from "@pipedream/clio";
const clio = {}; // stubbed by ingest: base module unavailable;
// commented by ingest: import ... from "@pipedream/clio/common/constants.mjs";
const constants = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...clio,
  type: "app",
  app: "clio_canada",
  methods: {
    ...clio.methods,
    getUrl(path) {
      return `https://ca.app.clio.com${constants.VERSION_PATH}${path}`;
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "clio_canada");
