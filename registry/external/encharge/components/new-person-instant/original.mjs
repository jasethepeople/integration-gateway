import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-person-instant/test-event.mjs";

export default {
  ...common,
  key: "encharge-new-person-instant",
  name: "New Person (Instant)",
  description: "Emit new event when a person is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "newUser";
    },
    generateMeta({
      endUserData: [
        data,
      ],
    }) {
      return {
        id: data.id,
        summary: `New person with ID ${data.id} created`,
        ts: data.createdAt,
      };
    },
  },
  sampleEmit,
};
