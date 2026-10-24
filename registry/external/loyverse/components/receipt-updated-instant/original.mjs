import common from "../../shared/sources/common/common.mjs";
import sampleEmit from "../../shared/sources/receipt-updated-instant/test-event.mjs";

export default {
  ...common,
  key: "loyverse-receipt-updated-instant",
  name: "Receipt Updated (Instant)",
  description: "Emit new event when a receipt is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  methods: {
    ...common.methods,
    getSummary(body) {
      const { length } = body.receipts;
      return `${length} receipt${length === 1
        ? ""
        : "s"} updated`;
    },
    getHookType() {
      return "receipts.update";
    },
  },
};
