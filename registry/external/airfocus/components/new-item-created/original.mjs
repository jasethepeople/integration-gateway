import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-item-created/test-event.mjs";

export default {
  ...common,
  key: "airfocus-new-item-created",
  name: "New Item Created",
  description: "Emit new event when a fresh item is created.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilterField() {
      return "createdAt";
    },
    getSummary(item) {
      return `New Item Created: ${item.name}`;
    },
  },
  sampleEmit,
};
