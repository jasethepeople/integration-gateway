import shopify from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/shopify/sources/collection-updated/collection-updated.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-product-added-to-custom-collection",
  version: "0.0.17",
  name,
  description,
  type,
  props: {
    app: shopify,
    ...props,
  },
};
