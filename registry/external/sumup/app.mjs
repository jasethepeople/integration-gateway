import { axios } from "../_platform-shim.mjs";
import constants from "./shared/common/constants.mjs";

const __pdApp = {
  type: "app",
  app: "sumup",
  propDefinitions: {
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Filter by current status of the transaction",
      options: constants.TRANSACTION_STATUSES,
      optional: true,
    },
    paymentTypes: {
      type: "string[]",
      label: "Payment Types",
      description: "Filter by payment type used for the transaction",
      options: constants.PAYMENT_TYPES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sumup.com/v0.1/me";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getMerchantProfile(opts = {}) {
      return this._makeRequest({
        path: "/merchant-profile",
        ...opts,
      });
    },
    retrieveDba(opts = {}) {
      return this._makeRequest({
        path: "/merchant-profile/doing-business-as",
        ...opts,
      });
    },
    listTransactions(opts = {}) {
      return this._makeRequest({
        path: "/transactions/history",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "sumup");
