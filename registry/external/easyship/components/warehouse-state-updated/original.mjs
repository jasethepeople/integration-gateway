import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/warehouse-state-updated/test-event.mjs";

export default {
  ...common,
  key: "easyship-warehouse-state-updated",
  name: "Warehouse State Updated (Instant)",
  description: "Emit new event when a warehouse state is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "shipment_warehouse_state_updated";
    },
  },
  sampleEmit,
};
