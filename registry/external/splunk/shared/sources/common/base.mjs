import splunk from "../../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  props: {
    splunk,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    async getRecentJobIds() {
      const results = this.splunk.paginate({
        resourceFn: this.splunk.listJobs,
      });
      const jobIds = [];
      for await (const job of results) {
        jobIds.push(job.content.sid);
      }
      return jobIds;
    },
  },
};
