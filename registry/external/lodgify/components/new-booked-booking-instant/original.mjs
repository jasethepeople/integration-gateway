import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-booked-booking-instant/test-event.mjs";

export default {
  ...common,
  key: "lodgify-new-booked-booking-instant",
  name: "New Booked Booking (Instant)",
  description: "Emit new event when a new booking is created with the status 'Booked'.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "booking_new_status_booked";
    },
    generateMeta(body) {
      const ts = Date.now();
      return {
        id: `${body[0].booking.id}-${ts}`,
        summary: `Booking booked: ${body[0].booking.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
