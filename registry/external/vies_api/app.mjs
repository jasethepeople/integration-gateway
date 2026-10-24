import VIESAPI from "viesapi-client";

const __pdApp = {
  type: "app",
  app: "vies_api",
  methods: {
    _client() {
      return new VIESAPI.VIESAPIClient();
    },
    getVATData({ number }) {
      return this._client().getVIESData(number);
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "vies_api");
