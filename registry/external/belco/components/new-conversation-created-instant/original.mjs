import common from "../../shared/sources/common/base-webhook.mjs";
import sampleEmit from "../../shared/sources/new-conversation-created-instant/test-event.mjs";

export default {
  ...common,
  key: "belco-new-conversation-created-instant",
  name: "New Conversation Created (Instant)",
  description: "Emit new event for each new conversation created event",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "conversation.created",
      ];
    },
  },
  sampleEmit,
};
