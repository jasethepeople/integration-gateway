import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-conversation-created-instant/test-event.mjs";

export default {
  ...common,
  key: "help_scout-new-conversation-created-instant",
  name: "New Conversation Created (Instant)",
  description: "Emit new event when a new conversation is created.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "convo.created",
      ];
    },
    getSummary(body) {
      return `New conversation created: ${body.subject}`;
    },
  },
  sampleEmit,
};
