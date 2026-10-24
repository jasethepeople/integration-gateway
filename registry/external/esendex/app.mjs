import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "esendex",
  propDefinitions: {
    accountReference: {
      type: "string",
      label: "Account Reference",
      description: "The account reference to use for the request",
      async options() {
        const { accounts } = await this.listAccounts();
        return accounts.map((account) => ({
          label: account.label,
          value: account.reference,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.esendex.com/v1.0";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.username}`,
          password: `${this.$auth.api_password}`,
        },
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listMessages(opts = {}) {
      return this._makeRequest({
        path: "/messageheaders",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messagedispatcher",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "esendex");
