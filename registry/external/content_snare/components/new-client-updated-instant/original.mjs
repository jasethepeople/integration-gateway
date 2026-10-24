import common from "../../shared/sources/common/webhook.mjs";
import subscription from "../../shared/sources/common/subscription.mjs";
import sampleEmit from "../../shared/sources/new-client-updated-instant/test-event.mjs";

export default {
  ...common,
  key: "content_snare-new-client-updated-instant",
  name: "New Client Updated (Instant)",
  description: "Emit new event when a client is updated in Content Snare. [See the documentation](https://contentsnare.com/help/knowledge-base/content-snare-webhooks/#client-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptions() {
      return [
        subscription.CLIENT_UPDATED,
      ];
    },
    generateMeta(resource) {
      const { id } = resource;
      const ts = Date.now();
      return {
        id: `${id}-${ts}`,
        summary: `Client Updated: ${id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
