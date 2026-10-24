import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-booking-removed/test-event.mjs";

export default {
  ...common,
  key: "uplisting-new-booking-removed",
  name: "New Booking Removed (Instant)",
  description: "Emit new event when a booking is removed.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return "booking_removed";
    },
    getSummary(id) {
      return `The booking with id ${id} has been removed!`;
    },
  },
  sampleEmit,
};
