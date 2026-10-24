import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/updated-person-instant/test-event.mjs";

export default {
  ...common,
  key: "encharge-updated-person-instant",
  name: "Updated Person (Instant)",
  description: "Emit new event when a person is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "updatedUser";
    },
    generateMeta({
      endUserData: [
        data,
      ],
    }) {
      return {
        id: data.id,
        summary: `Person with ID ${data.id} updated`,
        ts: data.createdAt,
      };
    },
  },
  sampleEmit,
};
