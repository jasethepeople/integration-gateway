import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "vtiger_crm",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.instance}.vtiger.com/restapi/v1/vtiger/default`;
    },
    _getAuth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.access_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._getAuth(),
        ...args,
      });
    },
    getSync(args = {}) {
      return this._makeRequest({
        path: "/sync",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "vtiger_crm");
