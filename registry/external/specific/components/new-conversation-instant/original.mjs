import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-conversation-instant/test-event.mjs";

export default {
  ...common,
  key: "specific-new-conversation-instant",
  name: "New Conversation Instant",
  description: "Emit new event whenever a new conversation is initiated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getOperation() {
      return "new-conversation";
    },
    getSummary(body) {
      return `New conversation initiated: ${body.name}`;
    },
  },
  sampleEmit,
};
