import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-purchase-updated/test-event.mjs";

export default {
  ...common,
  key: "quickbooks-new-purchase-updated",
  name: "New Purchase Updated",
  description: "Emit new event when a purchase is updated.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getQuery(lastDate) {
      return `select * from Purchase Where Metadata.LastUpdatedTime >= '${lastDate}' orderby Metadata.LastUpdatedTime desc`;
    },
    getFieldList() {
      return "Purchase";
    },
    getFieldDate() {
      return "LastUpdatedTime";
    },
    getSummary(item) {
      return `New Purchase Updated: ${item.Id}`;
    },
  },
  sampleEmit,
};
