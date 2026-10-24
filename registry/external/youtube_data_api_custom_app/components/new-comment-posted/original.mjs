import youtubeDataApi from "../../app.mjs";
// commented by ingest: import ... from "@pipedream/youtube_data_api/sources/new-comment-posted/common.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  type: "source",
  key: "youtube_data_api_custom_app-new-comment-posted",
  name: "New Comment Posted",
  description: "Emit new event for each new comment or reply posted to a Youtube video.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    videoId: {
      type: "string",
      label: "Video Id",
      description: "Return comment threads associated with the specified video ID.",
    },
    ...common.props,
  },
};
