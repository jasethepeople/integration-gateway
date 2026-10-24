import shopify from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/shopify/actions/update-product-variant/update-product-variant.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-update-product-variant",
  version: "0.0.19",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
