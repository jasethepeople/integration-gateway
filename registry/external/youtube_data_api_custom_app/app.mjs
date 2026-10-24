// commented by ingest: import ... from "@pipedream/youtube_data_api/common-app.mjs";
const commonApp = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...commonApp,
  type: "app",
  app: "youtube_data_api_custom_app",
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "youtube_data_api_custom_app");
