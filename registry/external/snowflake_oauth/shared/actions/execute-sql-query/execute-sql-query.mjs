import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/snowflake/actions/execute-sql-query/execute-sql-query.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "snowflake_oauth-execute-sql-query",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    snowflake: app,
    ...props,
    sql: {
      ...props.sql,
      auth: {
        app: "snowflake_oauth",
      },
    },
  },
};
