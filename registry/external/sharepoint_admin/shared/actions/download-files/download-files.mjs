// commented by ingest: import ... from "@pipedream/sharepoint/actions/download-files/download-files.mjs";
const downloadFiles = {}; // stubbed by ingest: base module unavailable;
import utils from "../../common/utils.mjs";
import { addCustomFields } from
  "../../common/customFields.mjs";

export default {
  ...downloadFiles,
  ...utils.getAppProps(downloadFiles),
  key: "sharepoint_admin-download-files",
  name: downloadFiles.name,
  description: downloadFiles.description,
  type: downloadFiles.type,
  version: "0.0.4",
  methods: {
    ...downloadFiles.methods,
  },
  async run(opts) {
    this.sharepoint = this.sharepointAdmin;
    const result =
      await downloadFiles.run.call(this, opts);
    return addCustomFields(result);
  },
};
