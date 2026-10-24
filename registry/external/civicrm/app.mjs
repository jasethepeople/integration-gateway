import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "civicrm",
  propDefinitions: {},
  methods: {
    getUrl(path) {
      const { url: domain } = this.$auth;
      if (domain.includes("://")) {
        return domain + path;
      }
      return `https://${domain}${path}`;
    },
    getHeaders() {
      const {
        username,
        password,
      } = this.$auth;
      const base64 = Buffer.from(`${username}:${password}`).toString("base64");
      return {
        "_authx": `Basic ${base64}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    } = {}) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(),
        ...otherOpts,
      });
    },
    getContacts(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/civicrm/ajax/api4/Contact/get",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "civicrm");
