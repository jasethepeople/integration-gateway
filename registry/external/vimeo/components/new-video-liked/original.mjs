import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-video-liked/test-event.mjs";

export default {
  ...common,
  key: "vimeo-new-video-liked",
  name: "New Video Liked",
  description: "Emit new event each time the user likes a new video on Vimeo.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.vimeo.listLikedVideos;
    },
    getSummary(video) {
      return `New liked video: ${video.name}`;
    },
  },
  sampleEmit,
};
