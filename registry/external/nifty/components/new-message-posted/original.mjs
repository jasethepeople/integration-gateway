import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-message-posted/test-event.mjs";

export default {
  ...common,
  key: "nifty-new-message-posted",
  name: "New Message Posted",
  description: "Emit new event when a new message is posted in a team's discussion.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "messageCreated",
      ];
    },
    getSummary({ data }) {
      return `New message posted in project with ID: ${data.id}`;
    },
  },
  sampleEmit,
};
