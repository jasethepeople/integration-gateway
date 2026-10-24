import notion from "@notionhq/client";
// commented by ingest: import ... from "@pipedream/notion";
const common = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...common,
  type: "app",
  app: "notion_api_key",
  methods: {
    ...common.methods,
    _getNotionClient() {
      return new notion.Client({
        auth: this.$auth.api_secret,
        notionVersion: "2022-02-22",
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "notion_api_key");
