import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "burstyai",
  methods: {
    _baseUrl() {
      return "https://app.burstyai.com/burstyai";
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
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    triggerWorkflow({
      workflow, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/aiflows/${workflow}/async_run`,
        ...args,
      });
    },
    getWorkflowExecutionResult({
      jobId, ...args
    }) {
      return this._makeRequest({
        path: `/aiflowjobs/${jobId}/result`,
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "burstyai");
