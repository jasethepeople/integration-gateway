import common from "../../shared/sources/common/tasks.mjs";
import sampleEmit from "../../shared/sources/new-completed-task/test-event.mjs";

export default {
  ...common,
  key: "height-new-completed-task",
  name: "New Completed Task",
  description: "Emit new event when a task is marked as complete.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "completedAt";
    },
    getSummary(task) {
      return `Task Completed: ${task.name}`;
    },
  },
  sampleEmit,
};
