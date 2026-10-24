import { ConfigurationError } from "../../../_platform-shim.mjs";

export const checkWarnings = (response) => {
  if (response.warnings) {
    throw new ConfigurationError(response.warnings[0]);
  }
  if (response.notices) {
    throw new ConfigurationError(response.notices[0]);
  }
};
