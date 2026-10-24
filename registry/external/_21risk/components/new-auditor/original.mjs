import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-auditor/test-event.mjs";

export default {
  ...common,
  key: "_21risk-new-auditor",
  name: "New Auditor Created",
  description: "Emit new event when a new auditor is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "_KeyAuditorId";
    },
    getFunction() {
      return this._21risk.listAuditors;
    },
    getSummary(item) {
      return `New Auditor: ${item["Auditor Name"]}`;
    },
  },
  sampleEmit,
};
