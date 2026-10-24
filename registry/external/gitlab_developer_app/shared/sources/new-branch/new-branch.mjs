import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/gitlab/sources/new-branch/new-branch.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "gitlab_developer_app-new-branch",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    gitlab: app,
    ...props,
  },
};
