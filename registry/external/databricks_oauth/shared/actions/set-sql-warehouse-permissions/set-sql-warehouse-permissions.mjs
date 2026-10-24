import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/databricks/actions/set-sql-warehouse-permissions/set-sql-warehouse-permissions.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "databricks_oauth-set-sql-warehouse-permissions",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    databricks: app,
    ...props,
  },
};
