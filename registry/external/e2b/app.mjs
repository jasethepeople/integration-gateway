import { Sandbox } from "@e2b/code-interpreter@1.0.3";

const __pdApp = {
  type: "app",
  app: "e2b",
  methods: {
    getSandbox() {
      process.env.E2B_API_KEY = this.$auth.api_key;
      return Sandbox.create();
    },
    async runCode(code) {
      const sandbox = await this.getSandbox();
      return sandbox.runCode(code);
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "e2b");
