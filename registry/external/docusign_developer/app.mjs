// commented by ingest: import ... from "@pipedream/docusign/common.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...common,
  type: "app",
  app: "docusign_developer",
  methods: {
    ...common.methods,
    async getUserInfo({ $ }) {
      const config = {
        method: "GET",
        url: "https://account-d.docusign.com/oauth/userinfo",
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
__pdBind(__pdApp, "docusign_developer");
