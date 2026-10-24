import canva from "../../app.mjs";
// commented by ingest: import ... from "@pipedream/canva/actions/upload-asset/upload-asset.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  key: "canva_enterprise-upload-asset",
  name: "Upload Asset",
  description: "Uploads an asset to Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/assets/create-asset-upload-job/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    canva,
    name: {
      type: "string",
      label: "Asset Name",
      description: "The asset's name",
    },
    filePath: {
      propDefinition: [
        canva,
        "filePath",
      ],
    },
    waitForCompletion: {
      propDefinition: [
        canva,
        "waitForCompletion",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
};
