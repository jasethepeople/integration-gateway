import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-client/test-event.mjs";

export default {
  ...common,
  key: "hubstaff-new-client",
  name: "New Client Created",
  description: "Emit new event when a new client is created in Hubstaff.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModel() {
      return "clients";
    },
    getFunction() {
      return this.hubstaff.listClients;
    },
    getSummary(item) {
      return `New Client: ${item.name}`;
    },
  },
  sampleEmit,
};
