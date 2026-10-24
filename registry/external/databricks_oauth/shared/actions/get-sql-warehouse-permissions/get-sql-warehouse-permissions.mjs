import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/databricks/actions/get-sql-warehouse-permissions/get-sql-warehouse-permissions.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "databricks_oauth-get-sql-warehouse-permissions",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    databricks: app,
    ...props,
  },
};
