import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/snowflake/actions/insert-row/insert-row.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "snowflake_oauth-insert-row",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    snowflake: app,
    ...props,
  },
};
