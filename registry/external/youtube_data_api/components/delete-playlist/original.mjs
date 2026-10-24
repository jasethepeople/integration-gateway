import youtubeDataApi from "../../app.mjs";
import common from "../../shared/actions/delete-playlist/common.mjs";

export default {
  ...common,
  key: "youtube_data_api-delete-playlist",
  name: "Delete Playlist",
  description: "Deletes a playlist. [See the documentation](https://developers.google.com/youtube/v3/docs/playlists/delete) for more information",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    youtubeDataApi,
    playlistId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedPlaylist",
      ],
    },
    onBehalfOfContentOwner: {
      propDefinition: [
        youtubeDataApi,
        "onBehalfOfContentOwner",
      ],
    },
    ...common.props,
  },
};
