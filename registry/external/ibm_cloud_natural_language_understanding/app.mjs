const __pdApp = {
  type: "app",
  app: "ibm_cloud_natural_language_understanding",
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
__pdBind(__pdApp, "ibm_cloud_natural_language_understanding");
