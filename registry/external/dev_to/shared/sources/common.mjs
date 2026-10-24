import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../_platform-shim.mjs";

export default {
  props: {
    db: "$.service.db",
    timer: {
      label: "Timer",
      description: "How often to poll Dev.to for new articles",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
};
