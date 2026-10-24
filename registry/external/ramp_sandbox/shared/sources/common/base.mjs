import ramp from "../../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";
// commented by ingest: import ... from "@pipedream/ramp/sources/common/base.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  props: {
    ramp,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
};
