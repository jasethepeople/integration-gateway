import { axios } from "../_platform-shim.mjs";
import constants from "./shared/common/constants.mjs";

const __pdApp = {
  type: "app",
  app: "gpt_trainer",
  propDefinitions: {
    chatbotUuid: {
      type: "string",
      label: "Chatbot UUID",
      description: "The UUID of the chatbot",
      async options() {
        const chatbots = await this.listChatbots();
        return chatbots.map(({
          uuid: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sessionUuid: {
      type: "string",
      label: "Session UUID",
      description: "The UUID of the chatbot session",
      async options({ chatbotUuid }) {
        const sessions = await this.listChatbotSessions({
          chatbotUuid,
        });
        return sessions.map(({
          uuid: value, modified_at: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listChatbots(args = {}) {
      return this._makeRequest({
        path: "/chatbots",
        ...args,
      });
    },
    listChatbotSessions({
      chatbotUuid, ...args
    } = {}) {
      return this._makeRequest({
        path: `/chatbot/${chatbotUuid}/sessions`,
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "gpt_trainer");
