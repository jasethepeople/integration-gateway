import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "the_magic_drip",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select a campaign",
      async options() {
        const { campaigns } = await this.listCampaigns();
        return campaigns?.map((campaign) => ({
          label: campaign.name,
          value: campaign.workflowId,
        }));
      },
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn URL of the lead",
      optional: true,
    },
    desiredState: {
      type: "boolean",
      label: "Desired State",
      description: "Set to true to activate, false to deactivate the campaign",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.themagicdrip.com/v1";
    },
    async _makeRequest({
      $, path, headers, ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaign",
        ...opts,
      });
    },
    async addLeadToCampaign({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/campaign/leads/${campaignId}`,
        ...opts,
      });
    },
    async markCampaignActiveInactive({
      campaignId, activate, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/campaign/${campaignId}/${activate
          ? "active"
          : "inactive"}`,
        ...opts,
      });
    },
    async listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "the_magic_drip");
