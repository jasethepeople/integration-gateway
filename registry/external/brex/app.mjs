// x-pd-ai: optimized
import commonApp from "./shared/common-app.mjs";

const __pdApp = {
  ...commonApp,
  type: "app",
  app: "brex",
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "brex");
