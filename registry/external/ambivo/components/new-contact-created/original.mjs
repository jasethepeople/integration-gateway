import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-contact-created/test-event.mjs";

export default {
  ...common,
  key: "ambivo-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created in Ambivo.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.ambivo.listContacts;
    },
    getTsField() {
      return "created_date";
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact: ${contact.name}`,
        ts: Date.parse(contact.created_date),
      };
    },
  },
  sampleEmit,
};
