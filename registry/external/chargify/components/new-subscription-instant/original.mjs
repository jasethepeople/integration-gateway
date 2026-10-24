import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-subscription-instant/test-event.mjs";

export default {
  ...common,
  key: "chargify-new-subscription-instant",
  name: "New Subscription (Instant)",
  description: "Emit new event when a new subscription is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "signup_success";
    },
    getSummary(item) {
      return `New Subscription with ID: ${item["payload[subscription][id]"]}`;
    },
  },
  sampleEmit,
};
