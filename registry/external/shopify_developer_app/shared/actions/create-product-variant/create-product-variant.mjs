import shopify from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/shopify/actions/create-product-variant/create-product-variant.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-create-product-variant",
  version: "0.0.18",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
