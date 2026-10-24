// commented by ingest: import ... from "@pipedream/notiff_io/actions/create-notification/create-notification.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../shared/common/utils.mjs";
import app from "../../app.mjs";

const props = adjustPropDefinitions(common.props, app);

export default {
  ...common,
  key: "notiff-create-notification",
  name: "Create Notification",
  description: "Send a new notification to a user or system via notiff.io. [See the documentation](https://notiff.io/articles/welcome-to-notiff-getting-started-with-your-notification-center)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    getNotificationSourceId() {
      return this.app.$auth.notification_source_id;
    },
  },
  props: {
    app,
    ...props,
  },
};
