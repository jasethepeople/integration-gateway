import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-approval-event-instant/test-event.mjs";

export default {
  ...common,
  key: "ironclad-new-approval-event-instant",
  name: "New Approval Event Instant",
  description: "Emit new event when a fresh approval event is generated.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "workflow_approval_status_changed",
      ];
    },
  },
  sampleEmit,
};
