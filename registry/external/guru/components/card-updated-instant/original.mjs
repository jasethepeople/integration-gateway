import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/card-updated-instant/test-event.mjs";

export default {
  ...common,
  key: "guru-card-updated-instant",
  name: "Card Updated (Instant)",
  description: "Emit new event when a user makes an edit to a card. [See the documentation](https://developer.getguru.com/docs/creating-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "card-updated";
    },
    getSummary(body) {
      return `Card Updated: ${body.properties.cardId}`;
    },
  },
  sampleEmit,
};
