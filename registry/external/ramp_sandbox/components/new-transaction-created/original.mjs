import common from "../../shared/sources/common/base.mjs";
// commented by ingest: import ... from "@pipedream/ramp/sources/new-transaction-created/new-transaction-created.mjs";
const newTransactionCreated = {}; // stubbed by ingest: base module unavailable;
import sampleEmit from "../../shared/sources/new-transaction-created/test-event.mjs";

export default {
  ...common,
  key: "ramp_sandbox-new-transaction-created",
  name: "New Transaction Created",
  description: "Emit new event for each new transaction created in Ramp.",
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
    ...newTransactionCreated.methods,
  },
  sampleEmit,
};
