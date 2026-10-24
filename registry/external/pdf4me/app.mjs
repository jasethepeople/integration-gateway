import { axios } from "../_platform-shim.mjs";
import utils from "./shared/common/utils.mjs";

const __pdApp = {
  type: "app",
  app: "pdf4me",
  propDefinitions: {
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to process. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.doc`)",
      format: "file-ref",
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "The filename to save the resulting PDF in the /tmp directory",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pdf4me.com/api/v2";
    },
    async _makeRequest({
      $ = this,
      path = "/",
      ...otherOpts
    }) {
      try {
        return await axios($, {
          ...otherOpts,
          url: `${this._baseUrl()}${path}`,
          headers: {
            authorization: this.$auth.api_key,
          },
        });
      } catch (error) {
        utils.handleErrorMessage(error);
      }
    },
    convertToPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/ConvertToPdf",
        ...opts,
      });
    },
    mergePdfs(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Merge",
        ...opts,
      });
    },
    compressPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Optimize",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "pdf4me");
