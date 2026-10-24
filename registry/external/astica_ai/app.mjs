import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "astica_ai",
  methods: {
    _authData(data) {
      return {
        ...data,
        tkn: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      data = {},
      ...args
    }) { console.log(data);
      return axios($, {
        data: this._authData(data),
        method: "POST",
        ...args,
      });
    },
    describeImage(args = {}) {
      return this._makeRequest({
        url: "https://vision.astica.ai/describe",
        ...args,
      });
    },
    textToSpeech(args = {}) {
      return this._makeRequest({
        url: "https://voice.astica.ai/speak",
        ...args,
      });
    },
    speechToText(args = {}) {
      return this._makeRequest({
        url: "https://listen.astica.ai/transcribe",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "astica_ai");
