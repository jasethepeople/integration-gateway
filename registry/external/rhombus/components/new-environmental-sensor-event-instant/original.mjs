import common from "../../shared/sources/common/base-webhook.mjs";
import sampleEmit from "../../shared/sources/new-environmental-sensor-event-instant/test-event.mjs";

export default {
  ...common,
  key: "rhombus-new-environmental-sensor-event-instant",
  name: "New Environmental Sensor Event (Instant)",
  description: "Emit new event when a new environmental sensor event is created. [See the documentation](https://apidocs.rhombus.com/reference/subscribezapierwebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "ENVIRONMENTAL_SENSOR_EVENTS";
    },
  },
  sampleEmit,
};
