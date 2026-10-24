import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-ticket/test-event.mjs";

export default {
  ...common,
  key: "richpanel-new-ticket",
  name: "New Support Ticket Created",
  description: "Emit new event when a support ticket is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "createdAt";
    },
    getSummary(item) {
      return `New Ticket: ${item.subject}`;
    },
  },
  sampleEmit,
};
