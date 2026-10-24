import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "triggre",
  propDefinitions: {
    flowName: {
      type: "string",
      label: "Flow Name",
      description: "The name of the automation flow to start",
    },
    flowData: {
      type: "object",
      label: "Flow Data",
      description: "The data to pass to the automation flow",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.triggre_application_url}/${this.$auth.application_environment}/interfaces/rest`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this, path, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.application_username}`,
          password: `${this.$auth.application_password}`,
        },
      });
    },
    startAutomationFlow({
      flowName, flowNameWithUnderscores, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${flowName}/${flowNameWithUnderscores}`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "triggre");
