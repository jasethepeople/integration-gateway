import shopify from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/shopify/actions/submit-cancellation-request/submit-cancellation-request.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-submit-cancellation-request",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
