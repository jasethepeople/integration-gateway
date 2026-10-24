const __pdApp = {
  type: "app",
  app: "sap_s_4hana_cloud_sandbox",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "sap_s_4hana_cloud_sandbox");
