import airtable from "../../app.mjs";
import common from "../../shared/actions/common/common.mjs";
import commonActions from "../../shared/common/actions.mjs";

export default {
  key: "airtable_oauth-get-record",
  name: "Get Record",
  description: "Get data of a selected record from a table. [See the documentation](https://airtable.com/developers/web/api/get-record)",
  version: "0.0.16",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    returnFieldsByFieldId: {
      propDefinition: [
        airtable,
        "returnFieldsByFieldId",
      ],
    },
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
      ],
    },
  },
  async run({ $ }) {
    return commonActions.getRecord(this, $);
  },
};
