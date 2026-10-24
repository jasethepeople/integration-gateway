import { ConfigurationError } from "../../../_platform-shim.mjs";
export function parseJsonString(item) {
  try {
    return typeof item === "object"
      ? item
      : JSON.parse(item);
  } catch (e) {
    throw new ConfigurationError(`**Invalid JSON string:** "${e.message}"`);
  }
}
