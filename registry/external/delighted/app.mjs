import delightedLib from "delighted";

const __pdApp = {
  type: "app",
  app: "delighted",
  propDefinitions: {},
  methods: {
    lib() {
      return delightedLib(this.$auth.api_key);
    },
    async sendingToPeople(params) {
      return this.lib().person.create(params);
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "delighted");
