const __pdApp = {
  type: "app",
  app: "http",
  propDefinitions: {
    /* eslint-disable-next-line pipedream/props-description */
    httpRequest: {
      type: "http_request",
      label: "HTTP Request Configuration",
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "An optional summary. This will be emitted as the `summary` metadata for the event. Use dot notation to reference nested values. Example: `New item with ID: ${body.id}` or `User: ${body.user.name}`",
      optional: true,
    },
  },
  methods: {
    interpolateSummary(summary, context) {
      if (typeof summary !== "string") {
        return "";
      }
      if (!context || typeof context !== "object") {
        return summary;
      }
      return summary.replace(/\$\{([^}]+)\}/g, (_, path) => {
        return path
          .trim()
          .split(".")
          .reduce((obj, key) => obj?.[key], context) ?? "";
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "http");
