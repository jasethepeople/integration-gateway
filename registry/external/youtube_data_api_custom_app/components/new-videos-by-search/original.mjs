import youtubeDataApi from "../../app.mjs";
// commented by ingest: import ... from "@pipedream/youtube_data_api/sources/new-videos-by-search/common.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos-by-search",
  name: "New Videos by Search",
  description: "Emit new event for each new YouTube video matching a search query.",
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
