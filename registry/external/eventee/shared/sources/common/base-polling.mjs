import eventee from "../../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  props: {
    eventee,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
};
