import common from "../../shared/sources/common/base-webhook.mjs";
import sampleEmit from "../../shared/sources/new-contact-instant/test-event.mjs";

export default {
  ...common,
  key: "altoviz-new-contact-instant",
  name: "New Contact (Instant)",
  description: "Emit new event each time a contact is created, updated or deleted in Altoviz.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Select the contact event types to watch for",
      options: [
        "ContactCreated",
        "ContactUpdated",
        "ContactDeleted",
      ],
    },
  },
  sampleEmit,
};
