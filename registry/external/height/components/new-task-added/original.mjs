import common from "../../shared/sources/common/tasks.mjs";
import sampleEmit from "../../shared/sources/new-task-added/test-event.mjs";

export default {
  ...common,
  key: "height-new-task-added",
  name: "New Task Added",
  description: "Emit new event when a new task is added in Height",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "createdAt";
    },
    getSummary(task) {
      return `New Task: ${task.name}`;
    },
  },
  sampleEmit,
};
