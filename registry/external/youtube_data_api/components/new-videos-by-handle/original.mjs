import youtubeDataApi from "../../app.mjs";
import common from "../../shared/sources/new-videos-by-handle/common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-by-handle",
  name: "New Videos by Handle",
  description: "Emit new event for each new Youtube video tied to a handle.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
