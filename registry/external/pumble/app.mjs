import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "pumble",
  propDefinitions: {
    channel: {
      type: "string",
      label: "Channel",
      description: "The name of the channel",
      async options() {
        const channels = await this.listChannels();
        return channels
          ?.filter(({ channel }) => channel.name)
          ?.map(({ channel }) => channel.name) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://pumble-api-keys.addons.marketplace.cake.com";
    },
    _headers() {
      return {
        "Api-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listChannels(opts = {}) {
      return this._makeRequest({
        path: "/listChannels",
        ...opts,
      });
    },
    listMessages(opts = {}) {
      return this._makeRequest({
        path: "/listMessages",
        ...opts,
      });
    },
    createChannel(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createChannel",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sendMessage",
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "pumble");
