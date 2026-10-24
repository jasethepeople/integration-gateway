import splitwise from "../../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  props: {
    splitwise,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    logEmitEvent(list) {
      // eslint-disable-next-line multiline-ternary
      console.log(`Emitting ${list.length} event${list.length === 1 ? "" : "s"}...`);
    },
  },
};
