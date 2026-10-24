import common from "../../shared/sources/common/common.mjs";
import sampleEmit from "../../shared/sources/new-job-run-event/test-event.mjs";

export default {
  ...common,
  key: "dbt-new-job-run-event",
  name: "New Job Run Event (Instant)",
  description: "Emit new event when a job run has started, errored, or completed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Select the event types to watch",
      options: [
        "job.run.completed",
        "job.run.started",
        "job.run.errored",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return this.eventTypes;
    },
    generateMeta(body) {
      return {
        id: body.eventId,
        summary: `${body.eventType} for job "${body.data.jobName}"`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
