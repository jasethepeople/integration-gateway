// commented by ingest: import ... from "@pipedream/databricks";
const common = {}; // stubbed by ingest: base module unavailable;
import { axios } from "../_platform-shim.mjs";
// commented by ingest: import ... from "@pipedream/databricks/common/constants.mjs";
const constants = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...common,
  type: "app",
  app: "databricks_oauth",
  methods: {
    ...common.methods,
    getUrl(path, versionPath = constants.VERSION_PATH.V2_0) {
      return `https://${this.$auth.deployment_name}.${this.$auth.domain}${versionPath}${path}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, versionPath, ...args
    } = {}) {
      return axios($, {
        url: this.getUrl(path, versionPath),
        headers: this._headers(),
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "databricks_oauth");
