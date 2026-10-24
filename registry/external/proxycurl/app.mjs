import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "proxycurl",
  propDefinitions: {},
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://nubela.co/proxycurl/api";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._getApiKey()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async retrieveCompanyMetadataFromLinkedin(params) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/linkedin/company",
        params,
      });
    },
    async findSocialMediaProfilesFromEmail(params) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/linkedin/profile/resolve/email",
        params,
      });
    },
    async lookupEmailFromLinkedinProfile(params) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/linkedin/profile/email",
        params,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "proxycurl");
