import { ConfigurationError } from "../../../_platform-shim.mjs";

export function parseAsJSON(value) {
  try {
    return typeof value === "string"
      ? JSON.parse(value)
      : value;
  } catch (error) {
    throw new ConfigurationError(`Invalid JSON string: ${error.message}`);
  }
}
