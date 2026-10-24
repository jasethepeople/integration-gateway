import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-document-data-available/test-event.mjs";

export default {
  ...common,
  key: "docparser-new-document-data-available",
  name: "New Document Data Available",
  description: "Emit new event every time a document is processed and parsed data is available. [See the documentation](https://docparser.com/api/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listData;
    },
    getSummary(item) {
      return `New Document Parsed: ${item.file_name}`;
    },
  },
  sampleEmit,
};
