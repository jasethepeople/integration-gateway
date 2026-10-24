import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/monday/actions/create-update/create-update.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "monday_oauth-create-update",
  version: "0.0.5",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
