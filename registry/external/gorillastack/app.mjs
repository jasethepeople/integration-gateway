import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "gorillastack",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return `Bearer ${this.$auth.api_key}`;
    },
    _teamId() {
      return this.$auth.team_id;
    },
    _apiUrl() {
      return `https://api.gorillastack.com/v2/teams/${this._teamId()}`;
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          "Authorization": this._apiKey(),
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
    },
    inviteUser({
      $ = this,
      data,
    }) {
      return this._makeRequest({
        $,
        path: "/users/invite",
        method: "POST",
        data,
      });
    },
    getDeploymentTemplates({
      $ = this,
      params,
    }) {
      return this._makeRequest({
        $,
        path: "/templates/deployments",
        params,
      });
    },
    deployTemplate({
      $ = this,
      data,
    }) {
      return this._makeRequest({
        $,
        path: "/templates/deployments",
        method: "POST",
        data,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "gorillastack");
