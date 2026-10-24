import youtubeDataApi from "../../app.mjs";
import common from "../../shared/sources/new-liked-videos/common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-liked-videos",
  name: "New Liked Videos",
  description: "Emit new event for each new Youtube video liked by the authenticated user.",
  version: "0.0.6",
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
