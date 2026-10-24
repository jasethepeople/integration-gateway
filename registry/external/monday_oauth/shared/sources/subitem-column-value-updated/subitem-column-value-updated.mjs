import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/monday/sources/subitem-column-value-updated/subitem-column-value-updated.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "monday_oauth-subitem-column-value-updated",
  version: "0.0.5",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
