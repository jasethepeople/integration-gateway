import commonApp from "./shared/common-app.mjs";

const __pdApp = {
  ...commonApp,
  type: "app",
  app: "youtube_data_api",
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "youtube_data_api");
