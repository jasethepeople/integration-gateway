import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-invoice-instant/test-event.mjs";

export default {
  ...common,
  key: "alegra-new-invoice-instant",
  name: "New Invoice Created (Instant)",
  description: "Emit new event when a new invoice is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "new-invoice";
    },
    getSummary({ invoice }) {
      return `New invoice created: ${invoice.id}`;
    },
  },
  sampleEmit,
};
