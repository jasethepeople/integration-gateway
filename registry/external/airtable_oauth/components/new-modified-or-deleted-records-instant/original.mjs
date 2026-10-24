import common from "../../shared/sources/common/common-webhook-record.mjs";
import constants from "../../shared/sources/common/constants.mjs";
import sampleEmit from "../../shared/sources/new-modified-or-deleted-records-instant/test-event.mjs";
import airtable from "../../app.mjs";

export default {
  ...common,
  name: "New Record Created, Updated or Deleted (Instant)",
  description: "Emit new event when a record is added, updated, or deleted in a table or selected view.",
  key: "airtable_oauth-new-modified-or-deleted-records-instant",
  version: "0.1.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    changeTypes: {
      type: "string[]",
      label: "Update Types",
      description: "Select the types of record updates that should emit events. If not specified, all updates will emit events.",
      options: constants.CHANGE_TYPES,
      optional: true,
      default: [
        "add",
        "remove",
        "update",
      ],
    },
    watchDataInFieldIds: {
      propDefinition: [
        airtable,
        "sortFieldId",
      ],
      type: "string[]",
      label: "Watch Data In Field Ids",
      description:
        "Only emit events for updates that modify values in cells in these fields. If omitted, all fields within the table/view/base are watched",
    },
  },
  methods: {
    ...common.methods,
    getDataTypes() {
      return [
        "tableData",
      ];
    },
  },
  sampleEmit,
};
