import app from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/quickbooks/actions/create-sales-receipt/create-sales-receipt.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-create-sales-receipt",
  version: "0.0.4",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
