import godaddy from "../../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  props: {
    godaddy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
  },
};
