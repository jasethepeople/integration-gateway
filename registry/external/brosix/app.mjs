import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "brosix",
  propDefinitions: {
    msg: {
      type: "string",
      label: "Message",
      description: "The message that will be sent",
    },
  },
  methods: {
    _baseUrl() {
      return "https://box-n2.brosix.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          "apikey": `${this.$auth.api_key}`,
          ...params,
        },
      });
    },

    async sendMessage(args = {}) {
      return this._makeRequest({
        path: "/message/send/",
        method: "post",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "brosix");
