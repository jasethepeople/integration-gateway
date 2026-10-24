const __pdApp = {
  type: "app",
  app: "digitalocean_gradient_ai_serverless_inference",
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
__pdBind(__pdApp, "digitalocean_gradient_ai_serverless_inference");
