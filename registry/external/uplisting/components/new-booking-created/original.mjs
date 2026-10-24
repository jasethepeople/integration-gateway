import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-booking-created/test-event.mjs";

export default {
  ...common,
  key: "uplisting-new-booking-created",
  name: "New Booking Created (Instant)",
  description: "Emit new event when a booking is created.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return "booking_created";
    },
    getSummary(id) {
      return `A booking with id ${id} has been created!`;
    },
  },
  sampleEmit,
};
