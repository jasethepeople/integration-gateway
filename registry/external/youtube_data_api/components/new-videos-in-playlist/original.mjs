import youtubeDataApi from "../../app.mjs";
import common from "../../shared/sources/new-videos-in-playlist/common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-in-playlist",
  name: "New Videos in Playlist",
  description: "Emit new event for each new Youtube video added to a Playlist.",
  version: "0.0.12",
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
