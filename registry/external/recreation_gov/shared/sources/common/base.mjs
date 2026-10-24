import app from "../../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    getResourceFnConfig() {
      throw new Error("getResourceFnConfig() is not implemented!");
    },
    getMeta() {
      throw new Error("getMeta() is not implemented!");
    },
  },
};
