import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-invoice/test-event.mjs";

export default {
  ...common,
  key: "invoiced-new-invoice",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created. [See the documentation](https://developer.invoiced.com/api/invoices#list-all-invoices)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.invoiced.listInvoices;
    },
    getSummary(item) {
      return `New Invoice: ${item.id}`;
    },
  },
  sampleEmit,
};
