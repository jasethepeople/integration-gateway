import app from "../../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _setStartIndex(startIndex) {
      this.db.set("startIndex", startIndex);
    },
    _getStartIndex() {
      return this.db.get("startIndex") || 0;
    },
  },
};
