import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/deleted-issue-instant/test-event.mjs";

export default {
  ...common,
  key: "leiga-deleted-issue-instant",
  name: "New Deleted Issue (Instant)",
  description: "Emit new event when an issue is deleted in Leiga.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "delete";
    },
    getSummary(body) {
      return `New issue deleted with Id: ${body.data.issue.id}`;
    },
  },
  sampleEmit,
};
