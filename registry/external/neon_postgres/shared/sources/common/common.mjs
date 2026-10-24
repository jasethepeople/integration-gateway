import neon from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/postgresql/sources/common.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  ...common,
  props: {
    postgresql: neon,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
    },
  },
};
