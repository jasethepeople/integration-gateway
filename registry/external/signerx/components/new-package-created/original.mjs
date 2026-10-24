import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-package-created/test-event.mjs";

export default {
  ...common,
  key: "signerx-new-package-created",
  name: "New Package Created",
  description: "Emit new event when a package is newly created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getParams() {
      return {
        order_by: "created_at",
        direction: "desc",
      };
    },
    getSummary(item) {
      return `New Package Created: ${item.id}`;
    },
  },
  sampleEmit,
};
