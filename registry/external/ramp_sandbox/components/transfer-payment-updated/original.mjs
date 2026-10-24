import common from "../../shared/sources/common/base.mjs";
// commented by ingest: import ... from "@pipedream/ramp/sources/transfer-payment-updated/transfer-payment-updated.mjs";
const transferPaymentUpdated = {}; // stubbed by ingest: base module unavailable;
import sampleEmit from "../../shared/sources/transfer-payment-updated/test-event.mjs";

export default {
  ...common,
  key: "ramp_sandbox-transfer-payment-updated",
  name: "Transfer Payment Updated",
  description: "Emit new event when the status of a transfer payment changes",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    transferStatus: {
      propDefinition: [
        common.props.ramp,
        "transferStatus",
      ],
    },
  },
  methods: {
    ...common.methods,
    ...transferPaymentUpdated.methods,
  },
  sampleEmit,
};
