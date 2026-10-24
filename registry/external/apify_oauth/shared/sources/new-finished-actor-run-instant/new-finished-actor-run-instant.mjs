import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/apify/sources/new-finished-actor-run-instant/new-finished-actor-run-instant.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "apify_oauth-new-finished-actor-run-instant",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    apify: app,
    ...props,
  },
};
