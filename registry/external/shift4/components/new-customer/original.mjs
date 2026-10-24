import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-customer/test-event.mjs";

export default {
  ...common,
  key: "shift4-new-customer",
  name: "New Customer",
  description: "Emit new event when a new customer is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilterTypes() {
      return [
        "CUSTOMER_CREATED",
      ];
    },
    getSummary(item) {
      return `New customer created event with Id: ${item.id}`;
    },
  },
  sampleEmit,
};
