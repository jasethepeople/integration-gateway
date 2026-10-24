import app from "../../app.mjs";
// commented by ingest: import ... from "../../aws/common/common-s3.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  props: {
    aws: app,
    bucket: common.props.bucket,
    acl: {
      propDefinition: [
        app,
        "acl",
      ],
    },
    contentType: {
      propDefinition: [
        app,
        "contentType",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
};
