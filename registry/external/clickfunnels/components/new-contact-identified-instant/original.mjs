import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-contact-identified-instant/test-event.mjs";

export default {
  ...common,
  key: "clickfunnels-new-contact-identified-instant",
  name: "New Contact Identified (Instant)",
  description: "Emit new event when a fresh or formerly anonymous contact is identified via email address or contact number.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "contact.identified",
      ];
    },
    getSummary(body) {
      return `New contact identified: ${body.data.email_address || body.data.phone_number}`;
    },
  },
  sampleEmit,
};
