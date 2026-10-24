import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-booking-updated/test-event.mjs";

export default {
  ...common,
  key: "uplisting-new-booking-updated",
  name: "New Booking Updated (Instant)",
  description: "Emit new event when a booking is updated.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return "booking_updated";
    },
    getSummary(id) {
      return `The booking with id ${id} has been updated!`;
    },
  },
  sampleEmit,
};
