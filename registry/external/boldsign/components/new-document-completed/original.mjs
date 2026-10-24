import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-document-completed/test-event.mjs";

export default {
  ...common,
  key: "boldsign-new-document-completed",
  name: "New Document Completed",
  description: "Emit new event when a document is completed by all the signers.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.boldsign.listDocuments;
    },
    getSummary(item) {
      return `Document Completed: ${item.documentId}`;
    },
    getParams() {
      return {
        status: "Completed",
      };
    },
  },
  sampleEmit,
};
