import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-voicemail-instant/test-event.mjs";

export default {
  ...common,
  key: "krispcall-new-voicemail-instant",
  name: "New Voicemail (Instant)",
  description: "Emit new event when a new voicemail is sent.",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getAction() {
      return "new_voicemail";
    },
    getSummary() {
      return "New Voicemail";
    },
  },
  sampleEmit,
};
