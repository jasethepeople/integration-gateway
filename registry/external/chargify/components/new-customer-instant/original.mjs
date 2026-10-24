import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-customer-instant/test-event.mjs";

export default {
  ...common,
  key: "chargify-new-customer-instant",
  name: "New Customer (Instant)",
  description: "Emit new event when a new customer is added in Chargify",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "customer_create";
    },
    getSummary(item) {
      return `New Customer with ID: ${item["payload[customer][id]"]}`;
    },
  },
  sampleEmit,
};
