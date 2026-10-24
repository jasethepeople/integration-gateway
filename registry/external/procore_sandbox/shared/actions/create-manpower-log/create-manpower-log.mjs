// commented by ingest: import ... from "@pipedream/procore/actions/create-manpower-log/create-manpower-log.mjs";
const component = {}; // stubbed by ingest: base module unavailable;
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  ...utils.getAppProps(component),
  key: "procore_sandbox-create-manpower-log",
  description: "Create a new manpower log. [See the documentation](https://developers.procore.com/reference/rest/manpower-logs?version=latest#create-manpower-log).",
  version: "0.0.2",
};
