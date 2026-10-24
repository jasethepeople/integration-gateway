import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "castmagic",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.castmagic.io/v1";
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
          Authorization: `Bearer ${this.$auth.secret_key}`,
        },
      });
    },
    getTranscription({
      transcriptionId, ...opts
    }) {
      return this._makeRequest({
        path: `/transcripts/${transcriptionId}`,
        ...opts,
      });
    },
    submitTranscriptionRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transcripts",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "castmagic");
