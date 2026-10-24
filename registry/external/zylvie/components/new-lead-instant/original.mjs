import common from "../../shared/sources/common/webhook.mjs";
import triggers from "../../shared/sources/common/triggers.mjs";
import sampleEmit from "../../shared/sources/new-lead-instant/test-event.mjs";

export default {
  ...common,
  key: "zylvie-new-lead-instant",
  name: "New Lead (Instant)",
  description: "Emit new event when a user submits their name and email to receive a free product/lead magnet. [See the documentation](https://developers.zylvie.com/webhooks/subscribe).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggerName() {
      return triggers.LEAD;
    },
    generateMeta(payload) {
      const { data: resource } = payload;
      return {
        id: resource.transaction_id,
        summary: `New Lead: ${resource.transaction_id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
