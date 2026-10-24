import app from "../../../app.mjs";
// commented by ingest: import ... from "../../../aws/common/common-s3.mjs";
const pipedreamS3 = {}; // stubbed by ingest: base module unavailable;
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";

export default {
  ...pipedreamS3,
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    aws: app,
    bucket: pipedreamS3.props.bucket,
    prefix: {
      propDefinition: [
        app,
        "prefix",
      ],
    },
  },
  methods: {
    ...pipedreamS3.methods,
    getKey(file) {
      return file.Key;
    },
    getKeyTimestamp(file) {
      return `${file.Key}-${file.LastModified}`;
    },
    updateFileList() {
      throw new Error("updateFileList not implemented");
    },
    emitEvents() {
      throw new Error("emitEvents not implemented");
    },
    getFileList() {
      return this.db.get("fileList") || [];
    },
    setFileList(fileList) {
      this.db.set("fileList", fileList);
    },
  },
  async run() {
    const files = await this.aws.listFiles({
      Bucket: this.bucket,
      Prefix: this.prefix,
    });
    const events = await this.updateFileList(files);
    await this.emitEvents(events);
  },
};
