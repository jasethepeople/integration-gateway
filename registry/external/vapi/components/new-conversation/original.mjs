import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-conversation/test-event.mjs";

export default {
  ...common,
  key: "vapi-new-conversation",
  name: "New Conversation Started",
  description: "Emit new event when a voicebot starts a conversation.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.vapi.listCalls;
    },
    getSummary(item) {
      return `New Conversation: ${item.id}`;
    },
  },
  sampleEmit,
};
