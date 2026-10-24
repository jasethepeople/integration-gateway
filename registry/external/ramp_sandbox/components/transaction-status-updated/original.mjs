import common from "../../shared/sources/common/base.mjs";
// commented by ingest: import ... from "@pipedream/ramp/sources/transaction-status-updated/transaction-status-updated.mjs";
const transactionStatusUpdated = {}; // stubbed by ingest: base module unavailable;
import sampleEmit from "../../shared/sources/transaction-status-updated/test-event.mjs";

export default {
  ...common,
  key: "ramp_sandbox-transaction-status-updated",
  name: "Transaction Status Updated",
  description: "Emit new event when there is a change in transaction status.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    departmentId: {
      propDefinition: [
        common.props.ramp,
        "departmentId",
      ],
    },
    locationId: {
      propDefinition: [
        common.props.ramp,
        "locationId",
      ],
    },
  },
  methods: {
    ...common.methods,
    ...transactionStatusUpdated.methods,
  },
  sampleEmit,
};
