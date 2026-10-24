import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-message-instant/test-event.mjs";

export default {
  ...common,
  key: "_2chat-new-message-instant",
  name: "New Message (Instant)",
  description: "Emit new event when a new message is either sent or received on 2Chat.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "whatsapp.message.new";
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New Message ID: ${body.id}`,
        ts: Date.parse(body.created_at),
      };
    },
  },
  sampleEmit,
};
