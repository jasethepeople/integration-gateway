import { axios } from "../_platform-shim.mjs";
import { LIMIT } from "./shared/common/constants.mjs";

const __pdApp = {
  type: "app",
  app: "activecalculator",
  propDefinitions: {
    calculatorIds: {
      type: "string[]",
      label: "Calculator Ids",
      description: "A list of calculator's Ids.",
      async options({ page }) {
        const { data } = await this.listCalculators({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.activecalculator.com/api/v1";
    },
    _headers() {
      return {
        "x-ac-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listCalculators(opts = {}) {
      return this._makeRequest({
        path: "/calculators",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "activecalculator");
