import common from "../../shared/sources/common/common.mjs";
import sampleEmit from "../../shared/sources/action-created/test-event.mjs";

export default {
  ...common,
  key: "iauditor_by_safetyculture-action-created",
  name: "Action Created",
  description: "Emit new event when a new action is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "TRIGGER_EVENT_ACTION_CREATED";
    },
    generateMeta(action) {
      return {
        id: action.action_id,
        summary: `New action "${action.action_id}"`,
        ts: Date.parse(action.created_at),
      };
    },
  },
  sampleEmit,
};
