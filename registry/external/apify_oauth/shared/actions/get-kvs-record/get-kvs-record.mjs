import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/apify/actions/get-kvs-record/get-kvs-record.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "apify_oauth-get-kvs-record",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    apify: app,
    ...props,
  },
};
