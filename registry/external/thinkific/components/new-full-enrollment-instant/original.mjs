import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-full-enrollment-instant/test-event.mjs";

export default {
  ...common,
  key: "thinkific-new-full-enrollment-instant",
  name: "New Full Enrollment (Instant)",
  description: "Emit new event when a user enrolls in your course.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "enrollment.created";
    },
    getSummary(event) {
      return `New Enrollment in Course: ${event.payload.course.name}`;
    },
  },
  sampleEmit,
};
