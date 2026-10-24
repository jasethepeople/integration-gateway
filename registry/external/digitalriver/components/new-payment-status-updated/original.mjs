import { PAYMENT_STATUSES } from "../../shared/common/constants.mjs";
import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-payment-status-updated/test-event.mjs";

export default {
  ...common,
  key: "digitalriver-new-payment-status-updated",
  name: "New Payment Status Updated (Instant)",
  description: "Emit new event each time the payment status of an order is updated in Digital River.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTypes() {
      return PAYMENT_STATUSES;
    },
    getSummary(body) {
      return `Payment status updated for order ${body.data.object.id}`;
    },
  },
  sampleEmit,
};
