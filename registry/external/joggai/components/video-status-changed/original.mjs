import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/video-status-changed/test-event.mjs";

export default {
  ...common,
  key: "joggai-video-status-changed",
  name: "Video Status Changed (Instant)",
  description: "Emit new event when the status of a video changes in JoggAI.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    getEvents() {
      return [
        "generated_video_success",
        "generated_video_failed",
      ];
    },
    getSummary(details) {
      return `Video status changed: ${details.event}`;
    },
  },
  sampleEmit,
};
