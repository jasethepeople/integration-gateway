// commented by ingest: import ... from "@pipedream/clio";
const clio = {}; // stubbed by ingest: base module unavailable;
// commented by ingest: import ... from "@pipedream/clio/common/constants.mjs";
const constants = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...clio,
  type: "app",
  app: "clio_australia",
  methods: {
    ...clio.methods,
    getUrl(path) {
      return `https://au.app.clio.com${constants.VERSION_PATH}${path}`;
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "clio_australia");
