import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/updated-contact-instant/test-event.mjs";

export default {
  ...common,
  key: "icontact-updated-contact-instant",
  name: "Contact Updated (Instant)",
  description: "Emit new event when a contact is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "contact_updated";
    },
    generateMeta({ contact }) {
      return {
        id: contact.contactId,
        summary: `New contact updated: ${contact.email}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
