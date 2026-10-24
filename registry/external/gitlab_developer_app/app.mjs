// commented by ingest: import ... from "@pipedream/gitlab";
const common = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...common,
  app: "gitlab_developer_app",
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "gitlab_developer_app");
