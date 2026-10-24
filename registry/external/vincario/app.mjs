import { axios } from "../_platform-shim.mjs";
import crypto from "crypto";

const __pdApp = {
  type: "app",
  app: "vincario",
  propDefinitions: {
    vin: {
      type: "string",
      label: "VIN",
      description: "The Vehicle Identification Number",
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.vincario.com/3.2/${this.$auth.api_key}`;
    },
    _controlSum(id, vin) {
      return crypto.createHash("sha1")
        .update(`${vin.toUpperCase()}|${id}|${this.$auth.api_key}|${this.$auth.secret_key}`)
        .digest("hex")
        .substring(0, 10);
    },
    _makeRequest({
      $ = this, path, id, vin, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/${this._controlSum(id, vin)}${path}`,
        ...opts,
      });
    },
    getVinDecoderInfo({
      vin, ...opts
    }) {
      return this._makeRequest({
        path: `/decode/info/${vin}.json`,
        id: "info",
        vin,
        ...opts,
      });
    },
    decodeVin({
      vin, ...opts
    }) {
      return this._makeRequest({
        path: `/decode/${vin}.json`,
        id: "decode",
        vin,
        ...opts,
      });
    },
    checkStolen({
      vin, ...opts
    }) {
      return this._makeRequest({
        path: `/stolen-check/${vin}.json`,
        id: "stolen-check",
        vin,
        ...opts,
      });
    },
    getVehicleMarketValue({
      vin, ...opts
    }) {
      return this._makeRequest({
        path: `/vehicle-market-value/${vin}.json`,
        id: "vehicle-market-value",
        vin,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "vincario");
