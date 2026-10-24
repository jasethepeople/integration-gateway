import youtubeDataApi from "../../app.mjs";
// commented by ingest: import ... from "@pipedream/youtube_data_api/sources/new-videos-in-playlist/common.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos-in-playlist",
  name: "New Videos in Playlist",
  description: "Emit new event for each new Youtube video added to a Playlist.",
  version: "0.0.3",
  type: "source",
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
