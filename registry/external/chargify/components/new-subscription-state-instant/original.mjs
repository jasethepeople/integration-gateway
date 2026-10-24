import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-subscription-state-instant/test-event.mjs";

export default {
  ...common,
  key: "chargify-new-subscription-state-instant",
  name: "New Subscription State (Instant)",
  description: "Emit new event when the state of a subscription changes",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "subscription_state_change";
    },
    getSummary(item) {
      return `State updated for subscription ${item["payload[subscription][id]"]}`;
    },
  },
  sampleEmit,
};
