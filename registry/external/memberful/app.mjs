const __pdApp = {
  type: "app",
  app: "memberful",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log((this.$auth));
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "memberful");
