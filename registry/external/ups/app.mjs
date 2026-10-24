import { axios } from "../_platform-shim.mjs";
import { v4 as uuidv4 } from "uuid";
import constants from "./shared/common/constants.mjs";
const { VERSION } = constants;

const __pdApp = {
  type: "app",
  app: "ups",
  propDefinitions: {
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number of a shipment. Example: `1Z5338FF0107231059`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://onlinetools.ups.com/api";
      //return "https://wwwcie.ups.com/api"; // sandbox URL for testing
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          transactionsrc: "@PipedreamHQ/pipedream v0.1",
          transid: uuidv4(),
        },
        ...opts,
      });
    },
    createSubscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/track/v1/subscription/standard/package",
        ...opts,
      });
    },
    getTrackingInfo({
      trackingNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/track/v1/details/${trackingNumber}`,
        ...opts,
      });
    },
    createShipment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/shipments/${VERSION}/ship`,
        ...opts,
      });
    },
    voidShipment({
      trackingNumber, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/shipments/${VERSION}/void/cancel/${trackingNumber}`,
        ...opts,
      });
    },
    recoverLabel(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/labels/v1/recovery",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ups");
