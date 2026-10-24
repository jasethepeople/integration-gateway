import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "publisherkit",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use for image creation",
      async options() {
        const templates = await this.listTemplates();
        return templates?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.publisherkit.com/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/api/templates",
        ...opts,
      });
    },
    createImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create/images",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "publisherkit");
