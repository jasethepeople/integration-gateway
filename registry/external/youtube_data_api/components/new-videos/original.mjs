import youtubeDataApi from "../../app.mjs";
import common from "../../shared/sources/new-videos/common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos",
  name: "New Videos",
  description: "Emit new event for each new Youtube video the user posts.",
  version: "0.0.10",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    maxResults: {
      propDefinition: [
        youtubeDataApi,
        "maxResults",
      ],
    },
    ...common.props,
  },
};
