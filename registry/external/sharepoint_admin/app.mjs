// commented by ingest: import ... from "@pipedream/sharepoint";
const sharepoint = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...sharepoint,
  app: "sharepoint_admin",
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "sharepoint_admin");
