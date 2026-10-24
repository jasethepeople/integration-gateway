import thecolony from "../../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  props: {
    thecolony,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastSeenId() {
      return this.db.get("lastSeenId");
    },
    _setLastSeenId(id) {
      this.db.set("lastSeenId", id);
    },
  },
};
