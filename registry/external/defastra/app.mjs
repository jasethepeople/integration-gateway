import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "defastra",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to perform the risk analysis on.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to conduct the risk assessment and digital lookup for, in international format.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.defastra.com";
    },
    _headers() {
      return {
        "X-API-KEY": this.$auth.api_key,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    performEmailRiskAnalysis(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/deep_email_check",
        ...opts,
      });
    },
    performPhoneRiskAnalysis(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/deep_phone_check",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "defastra");
