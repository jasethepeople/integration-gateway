import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "alt_text_generator_ai",
  propDefinitions: {},
  methods: {
    generateAltText({
      $ = this, data, ...opts
    }) {
      return axios($, {
        url: "https://alttextgeneratorai.com/api/wp",
        method: "POST",
        data: {
          ...data,
          wpkey: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "alt_text_generator_ai");
