// commented by ingest: import ... from "@pipedream/linear_app/sources/project-updated-instant/project-updated-instant.mjs";
const projectUpdatedInstant = {}; // stubbed by ingest: base module unavailable;
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...projectUpdatedInstant,
  ...utils.getAppProps(projectUpdatedInstant),
  key: "linear-project-updated-instant",
  description: "Emit new event when a project is updated in Linear. Returns project details including name, description, status, dates, and team info. Supports filtering by specific teams. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  version: "0.0.13",
};
