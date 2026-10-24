import common from "../../shared/sources/common/webhook.mjs";
import events from "../../shared/sources/common/events.mjs";
import sampleEmit from "../../shared/sources/person-change-instant/test-event.mjs";

export default {
  ...common,
  key: "cloze-person-change-instant",
  name: "Person Change (Instant)",
  description: "Emit new event when significant changes happen to a person. [See the documentation](https://api.cloze.com/api-docs/#!/Webhooks/post_v1_subscribe).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.PERSON_CHANGE;
    },
    generateMeta(event) {
      return {
        id: event?.person.syncKey,
        summary: "New Person Change",
        ts: event?.person.lastChanged,
      };
    },
  },
  sampleEmit,
};
