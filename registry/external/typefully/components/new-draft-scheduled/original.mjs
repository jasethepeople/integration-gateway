import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-draft-scheduled/test-event.mjs";

export default {
  ...common,
  key: "typefully-new-draft-scheduled",
  name: "New Draft Scheduled",
  description: "Emit new event when a draft is scheduled for publication.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.typefully.getRecentlyScheduledDrafts;
    },
    getSummary(draft) {
      return `Scheduled draft: ${draft.id}`;
    },
  },
  sampleEmit,
};
