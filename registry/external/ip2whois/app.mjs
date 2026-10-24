import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "ip2whois",
  description: "WHOIS lookup API license key. You can sign up for a free license key at [here](https://ip2whois.com/register).",
  propDefinitions: {},
  methods: {
    async queryDomainInfo(customConfig) {
      const {
        $,
        params,
      } = customConfig;

      const config = {
        url: "https://api.ip2whois.com/v2/",
        params: {
          key: `${this.$auth.api_key}`,
          source: "pipedream",
          source_version: "1.0.0",
          ...params,
        },
      };

      return axios($, config);
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ip2whois");
