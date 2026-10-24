import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/customer-subscription-created/test-event.mjs";

export default {
  ...common,
  key: "copperx-customer-subscription-created",
  name: "New Customer Subscription Created (Instant)",
  description: "Emit new event when a new customer subcription is created.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "customer.subscription.created",
      ];
    },
    getSummary(id) {
      return `A new customer subscription with id: ${id} was created!`;
    },
  },
  sampleEmit,
};
