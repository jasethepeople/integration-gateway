import common from "../../shared/sources/common/polling.mjs";
import activityTypes from "../../shared/sources/common/activity-types.mjs";
import sampleEmit from "../../shared/sources/new-item-created/test-event.mjs";

export default {
  ...common,
  key: "onedesk-new-item-created",
  name: "New Item Created",
  description: "Emit new event when a new item is created. [See the documentation](https://www.onedesk.com/dev/).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getActivityTypeProperties() {
      return [
        {
          property: "types",
          operation: "EQ",
          value: activityTypes.CREATED_WORK_ITEM,
        },
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.itemExternalId,
        summary: `New Item Created: ${resource.itemName || resource.itemExternalId}`,
        ts: Date.parse(resource.timestamp),
      };
    },
  },
  sampleEmit,
};
