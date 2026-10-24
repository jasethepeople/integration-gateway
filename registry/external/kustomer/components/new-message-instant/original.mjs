import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-message-instant/test-event.mjs";

export default {
  ...common,
  key: "kustomer-new-message-instant",
  name: "New Message Created in Conversation (Instant)",
  description: "Emit new event when a new message is created in a conversation.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "kustomer.message.create",
      ];
    },
    getSummary(body) {
      return `New message created: ${body.dataId}`;
    },
  },
  sampleEmit,
};
