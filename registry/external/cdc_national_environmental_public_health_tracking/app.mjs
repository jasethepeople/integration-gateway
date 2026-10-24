const __pdApp = {
  type: "app",
  app: "cdc_national_environmental_public_health_tracking",
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
__pdBind(__pdApp, "cdc_national_environmental_public_health_tracking");
