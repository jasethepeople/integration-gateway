import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "offlight",
  methods: {
    _baseUrl() {
      return "https://api.offlight.work";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_token}`,
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
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/zapier/task",
        ...opts,
      });
    },
    getDoneTasks(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "GET",
        path: "/zapier/doneTasks",
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/zapier/webhook",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/zapier/webhook",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "offlight");
