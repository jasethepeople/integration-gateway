import { axios } from "../_platform-shim.mjs";
import constants from "./shared/common/constants.mjs";

const __pdApp = {
  type: "app",
  app: "npm",
  methods: {
    getUrl(path, api = constants.API.DEFAULT, withVersion = false) {
      return `${api.BASE_URL}${withVersion && api.VERSION_PATH || ""}${path}`;
    },
    makeRequest({
      $ = this, path, api, withVersion, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path, api, withVersion),
      });
    },
    getPackageMetadata({
      packageName, ...args
    } = {}) {
      return this.makeRequest({
        api: constants.API.REGISTRY,
        path: `/${packageName}`,
        headers: {
          "Accept": "application/vnd.npm.install-v1+json",
        },
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "npm");
