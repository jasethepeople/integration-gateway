import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-affiliates/test-event.mjs";

export default {
  ...common,
  key: "leaddyno-new-affiliates",
  name: "New Affiliates",
  description: "Emit new event when a new affiliate is created in LeadDyno. [See the documentation](https://app.theneo.io/leaddyno/leaddyno-rest-api/affiliates/get-affiliates)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.leaddyno.listAffiliates;
    },
    getSummary(item) {
      return `New Affiliate: ${item.email}`;
    },
  },
  sampleEmit,
};
