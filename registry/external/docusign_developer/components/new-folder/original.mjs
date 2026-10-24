import docusign from "../../app.mjs";
// commented by ingest: import ... from "@pipedream/docusign/sources/new-folder/common.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  key: "docusign_developer-new-folder",
  version: "0.0.3",
  name: "New Folder",
  description: "Emit new event when a new folder is created",
  type: "source",
  props: {
    docusign,
    account: {
      propDefinition: [
        docusign,
        "account",
      ],
    },
    ...common.props,
  },
};
