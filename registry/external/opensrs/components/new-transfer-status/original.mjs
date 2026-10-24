import common from "../../shared/sources/common/polling.mjs";
import events from "../../shared/sources/common/events.mjs";
import constants from "../../shared/common/constants.mjs";
import sampleEmit from "../../shared/sources/new-transfer-status/test-event.mjs";

export default {
  ...common,
  key: "opensrs-new-transfer-status",
  name: "New Transfer Status",
  description: "Emit new event when the status of a domain transfer changes. [See the documentation](https://domains.opensrs.guide/docs/status_change-transfer).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isResourceRelevant(resource) {
      return resource.object === constants.OBJECT_TYPE.TRANSFER
        && resource.event === events.STATUS_CHANGE;
    },
    generateMeta(resource) {
      return {
        id: resource.event_id,
        summary: `New Transfer Status: ${resource.objectData.domain_name}`,
        ts: Date.parse(resource.event_date),
      };
    },
  },
  sampleEmit,
};
