import base from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-comment/test-event.mjs";

export default {
  ...base,
  key: "announcekit-new-comment",
  name: "New Comment",
  description: "Emit new event when a new comment is created. [See the documentation](https://announcekit.app/docs/graphql-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getSummary(comment) {
      return `New Comment with ID: ${comment.id}`;
    },
    getVariables(variables) {
      return {
        ...variables,
        type: [
          "new-feedback",
        ],
      };
    },
  },
  sampleEmit,
};

