import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/databricks/actions/delete-vector-search-index-data/delete-vector-search-index-data.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "databricks_oauth-delete-vector-search-index-data",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    databricks: app,
    ...props,
  },
};
