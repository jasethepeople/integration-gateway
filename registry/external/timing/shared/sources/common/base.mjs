import timing from "../../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  props: {
    timing,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async getPaginatedTimeEntries() {
      const params = {
        page: 1,
      };
      let total;
      const results = [];
      do {
        const { data } = await this.timing.listTimeEntries({
          params,
        });
        results.push(...data);
        total = data?.length;
        params.page++;
      } while (total > 0);
      return results;
    },
  },
};
