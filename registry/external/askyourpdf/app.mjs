import {
  axios, ConfigurationError,
} from "../_platform-shim.mjs";
import constants from "./shared/common/constants.mjs";
import utils from "./shared/common/utils.mjs";

const __pdApp = {
  type: "app",
  app: "askyourpdf",
  methods: {
    exportSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export(constants.SUMMARY_LABEL, msg);
    },
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
        ...headers,
      };
    },
    async getConfig({
      headers, data: preData, ...args
    } = {}) {
      const contentType = constants.CONTENT_TYPE_KEY_HEADER;
      const hasMultipartHeader = utils.hasMultipartHeader(headers);
      const data = hasMultipartHeader && await utils.getFormData(preData) || preData;
      const currentHeaders = this.getHeaders(headers);

      return {
        headers: hasMultipartHeader
          ? {
            ...currentHeaders,
            [contentType]: data.getHeaders()[contentType.toLowerCase()],
          }
          : currentHeaders,
        data,
        ...args,
      };
    },
    async makeRequest({
      step = this, path, headers, data, summary, ...args
    } = {}) {
      const config = await this.getConfig({
        url: this.getUrl(path),
        headers,
        data,
        ...args,
      });

      const response = await axios(step, config);

      if (typeof summary === "function") {
        this.exportSummary(step)(summary(response));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "askyourpdf");
