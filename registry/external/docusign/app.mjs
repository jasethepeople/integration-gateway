import common from "./shared/common.mjs";

const __pdApp = {
  ...common,
  type: "app",
  app: "docusign",
  methods: {
    ...common.methods,
    async getUserInfo({ $ }) {
      const config = {
        method: "GET",
        url: "https://account.docusign.com/oauth/userinfo",
      };
      return this._makeRequest({
        $,
        config,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "docusign");
