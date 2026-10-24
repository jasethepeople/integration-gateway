import { axios } from "../_platform-shim.mjs";
import constants from "./shared/common/constants.mjs";

const __pdApp = {
  type: "app",
  app: "wolfram_alpha",
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getAuthParams(params) {
      return {
        ...params,
        appid: this.$auth.app_id,
      };
    },
    makeRequest({
      $ = this, path, params, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        params: this.getAuthParams(params),
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "wolfram_alpha");
