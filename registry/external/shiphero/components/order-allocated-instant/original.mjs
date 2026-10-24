import common from "../../shared/sources/common/webhook.mjs";
import events from "../../shared/sources/common/events.mjs";
import sampleEmit from "../../shared/sources/order-allocated-instant/test-event.mjs";

export default {
  ...common,
  key: "shiphero-order-allocated-instant",
  name: "Order Allocated (Instant)",
  description: "Emit new event when an order is allocated. [See the documentation](https://developer.shiphero.com/webhooks#webhook_create).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.ORDER_ALLOCATED;
    },
    generateMeta(resource) {
      return {
        id: resource.order_id,
        summary: `Order Allocated: ${resource.order_id}`,
        ts: Date.parse(resource.allocated_at),
      };
    },
  },
  sampleEmit,
};
