import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/launchdarkly/actions/get-feature-flag-status/get-feature-flag-status.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "launch_darkly_oauth-get-feature-flag-status",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    app,
    ...props,
  },
};
