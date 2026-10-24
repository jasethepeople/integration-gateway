import common from "../../shared/sources/common/base.mjs";
import constants from "../../shared/common/constants.mjs";
import sampleEmit from "../../shared/sources/new-conversation-instant/test-event.mjs";

export default {
  ...common,
  key: "_2chat-new-conversation-instant",
  name: "New Conversation (Instant)",
  description: "Emit new event when a new WhatsApp conversation is started on the user’s 2chat connected number.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    timePeriod: {
      type: "string",
      label: "Time Period",
      description: "Your preference to consider a conversation new",
      options: constants.TIME_PERIODS,
      optional: true,
      default: "all-time",
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "whatsapp.conversation.new";
    },
    getWebhookParams() {
      return {
        time_period: this.timePeriod,
      };
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New Conversation ID: ${body.id}`,
        ts: Date.parse(body.created_at),
      };
    },
  },
  sampleEmit,
};
