import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "realgeeks",
  methods: {
    async _makeRequest({
      $ = this,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: "https://receivers.leadrouter.realgeeks.com/rest",
        auth: {
          username: this.$auth.username,
          password: this.$auth.password,
        },
      });
    },
    async createLead(args) {
      return this._makeRequest({
        method: "post",
        url: `/sites/${this.$auth.site_uuid}/leads`,
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "realgeeks");
