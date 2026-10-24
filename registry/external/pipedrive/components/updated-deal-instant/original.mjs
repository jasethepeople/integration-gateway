import { parseData } from "../../shared/common/utils.mjs";
import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/updated-deal-instant/test-event.mjs";

export default {
  ...common,
  key: "pipedrive-updated-deal-instant",
  name: "Deal Updated (Instant)",
  description: "Emit new event when a deal is updated.",
  version: "0.1.14",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "change",
        event_object: "deal",
      };
    },
    getSummary(body) {
      return `Deal successfully updated: ${body.data.id}`;
    },
    async parseData(body) {
      return await parseData({
        fn: this.pipedrive.getDealCustomFields,
        body,
      });
    },
  },
  sampleEmit,
};
