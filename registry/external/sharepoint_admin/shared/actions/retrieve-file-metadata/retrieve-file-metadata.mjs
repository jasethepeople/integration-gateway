// commented by ingest: import ... from "@pipedream/sharepoint/actions/retrieve-file-metadata/retrieve-file-metadata.mjs";
const retrieveFileMetadata = {}; // stubbed by ingest: base module unavailable;
import sharepointAdmin from
  "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/sharepoint/common/utils.mjs";
const parseUtils = {}; // stubbed by ingest: base module unavailable;
import { addCustomFields } from
  "../../common/customFields.mjs";
import { ConfigurationError } from "../../../../_platform-shim.mjs";

export default {
  ...retrieveFileMetadata,
  key: "sharepoint_admin-retrieve-file-metadata",
  name: retrieveFileMetadata.name,
  description: retrieveFileMetadata.description,
  type: retrieveFileMetadata.type,
  version: "0.0.5",
  props: {
    sharepointAdmin,
    siteId: {
      propDefinition: [
        sharepointAdmin,
        "siteId",
      ],
      withLabel: true,
    },
    driveId: {
      propDefinition: [
        sharepointAdmin,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
      withLabel: true,
    },
    folderId: {
      propDefinition: [
        sharepointAdmin,
        "folderId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
      label: "Folder",
      description: "The folder to browse. Leave empty "
        + "to browse the root of the drive.",
      optional: true,
      withLabel: true,
    },
    fileIds: {
      propDefinition: [
        sharepointAdmin,
        "fileOrFolderId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
          folderId: c.folderId,
        }),
      ],
      type: "string[]",
      label: "Files",
      description:
        "Select one or more files to retrieve metadata for.",
      withLabel: true,
    },
  },
  methods: {
    ...retrieveFileMetadata.methods,
  },
  async run({ $ }) {
    this.sharepoint = this.sharepointAdmin;

    const selections =
      parseUtils.parseFileOrFolderList(this.fileIds);

    if (selections.length === 0) {
      throw new ConfigurationError(
        "Please select at least one file",
      );
    }

    const siteId =
      this.sharepoint.resolveWrappedValue(this.siteId);
    const driveId =
      this.sharepoint.resolveWrappedValue(this.driveId);

    const {
      fileResults,
      errors,
    } = await this.fetchFileMetadata(
      $, selections, siteId, driveId, {
        includeDownloadUrl: false,
      },
    );

    const result = this.processResults(
      $, fileResults, errors, [], {
        successVerb: "Retrieved",
        successNoun: "metadata",
      },
    );

    return addCustomFields(result);
  },
};
