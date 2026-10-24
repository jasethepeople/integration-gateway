import youtubeDataApi from "../../app.mjs";
import common from "../../shared/sources/new-subscriber/common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-subscriber",
  name: "New Subscriber",
  description: "Emit new event for each new Youtube subscriber to a user Channel.",
  version: "0.0.6",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    channelId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedChannel",
      ],
      description: "Select a Channel or provide a custom Channel ID. E.g. `UChkRx83xLq2nk55D8CRODVz`",
      optional: true,
    },
    ...common.props,
  },
};
