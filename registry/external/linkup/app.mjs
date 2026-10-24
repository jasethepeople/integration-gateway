import { LinkupClient } from "linkup-sdk";

const __pdApp = {
  type: "app",
  app: "linkup",
  propDefinitions: {},
  methods: {
    _getClient() {
      return new LinkupClient({
        apiKey: this.$auth.api_key,
      });
    },
    search(params) {
      const client = this._getClient();
      return client.search(params);
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "linkup");
