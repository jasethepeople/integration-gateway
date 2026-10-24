import common from "../../shared/sources/common/base-webhook.mjs";
import sampleEmit from "../../shared/sources/thread-assignment-transitioned/test-event.mjs";

export default {
  ...common,
  key: "plain-thread-assignment-transitioned",
  name: "Thread Assignment Transitioned",
  description: "Emit new event when a thread assignment is transitioned.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "thread.thread_assignment_transitioned";
    },
    getSummary({ payload }) {
      return `Thread Assignment Transitioned ID ${payload.thread.id}`;
    },
  },
  sampleEmit,
};
