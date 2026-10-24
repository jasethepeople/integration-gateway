import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/transaction-completed-instant/test-event.mjs";

export default {
  ...common,
  key: "fidel_api-transaction-completed-instant",
  name: "New Transaction Completed (Instant)",
  description: "Emit new event when a transaction is completed using a card linked to the Fidel API.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "transaction.auth";
    },
    getSummary(body) {
      return `Transaction completed: ${body.amount} ${body.currency}`;
    },
  },
  sampleEmit,
};
