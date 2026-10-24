import { ConfigurationError } from "../../../_platform-shim.mjs";

export function toInt(value, label) {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new ConfigurationError(`${label} must be an integer, got \`${value}\``);
  }
  return parsed;
}
