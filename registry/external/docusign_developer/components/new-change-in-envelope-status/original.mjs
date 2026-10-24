import docusign from "../../app.mjs";
// commented by ingest: import ... from "@pipedream/docusign/sources/new-change-in-envelope-status/common.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  key: "docusign_developer-new-change-in-envelope-status",
  version: "0.0.2",
  name: "New Change in Envelope Status",
  description: "Emit new event when an envelope's status is updated",
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
