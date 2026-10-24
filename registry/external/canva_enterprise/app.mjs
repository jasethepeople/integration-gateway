// commented by ingest: import ... from "@pipedream/canva";
const common = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...common,
  type: "app",
  app: "canva_enterprise",
  propDefinitions: {
    ...common.propDefinitions,
    brandTemplateId: {
      type: "string",
      label: "Brand Template ID",
      description: "The ID of a brand template",
      async options({ prevContext }) {
        const params = prevContext?.continuation
          ? {
            continuation: prevContext.continuation,
          }
          : {};
        const {
          items, continuation,
        } = await this.listBrandTemplates({
          params,
        });
        return {
          options: items?.map(({
            id: value, title: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            continuation,
          },
        };
      },
    },
  },
  methods: {
    ...common.methods,
    _auth() {
      return this.$auth.oauth_access_token;
    },
    listBrandTemplates(opts = {}) {
      return this._makeRequest({
        path: "/brand-templates",
        ...opts,
      });
    },
    getBrandTemplateDataset({
      brandTemplateId, ...opts
    }) {
      return this._makeRequest({
        path: `/brand-templates/${brandTemplateId}/dataset`,
        ...opts,
      });
    },
    createDesignAutofillJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/autofills",
        ...opts,
      });
    },
    getDesignAutofillJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/autofills/${jobId}`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "canva_enterprise");
