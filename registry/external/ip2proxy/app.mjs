import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "ip2proxy",
  propDefinitions: {},
  methods: {
    async queryIPInfo(customConfig) {
      const {
        $,
        params,
      } = customConfig;

      const config = {
        url: "https://api.ip2proxy.com/",
        params: {
          key: `${this.$auth.api_key}`,
          ...params,
        },
      };

      return axios($, config);
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "ip2proxy");
