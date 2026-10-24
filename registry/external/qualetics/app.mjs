import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "qualetics",
  propDefinitions: {
    dataMachineId: {
      type: "string",
      label: "Data Machine ID",
      description: "The ID of the Data Machine to initiate",
    },
  },
  methods: {
    _makeRequest(opts = {}) {
      const {
        $ = this,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    initiateDataMachine(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://mlapi.qualetics.com/api/datamachine/init",
        ...opts,
      });
    },
    sendData({
      params, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: "https://mq.qualetics.com/api/sendmessage",
        params: {
          ...params,
          "client_id": `${this.$auth.app_prefix}`,
        },
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "qualetics");
