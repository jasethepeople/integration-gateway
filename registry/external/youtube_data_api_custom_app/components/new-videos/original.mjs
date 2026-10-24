import youtubeDataApi from "../../app.mjs";
// commented by ingest: import ... from "@pipedream/youtube_data_api/sources/new-videos/common.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos",
  name: "New Videos",
  description: "Emit new event for each new Youtube video the user posts.",
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
