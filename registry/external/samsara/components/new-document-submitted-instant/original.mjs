import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-document-submitted-instant/test-event.mjs";

export default {
  ...common,
  key: "samsara-new-document-submitted-instant",
  name: "New Document Submitted (Instant)",
  description: "Emit new event when a document is submitted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "DocumentSubmitted",
      ];
    },
    getSummary({ data }) {
      return `New document with Id: ${data.document.id} successfully submitted!`;
    },
  },
  sampleEmit,
};
