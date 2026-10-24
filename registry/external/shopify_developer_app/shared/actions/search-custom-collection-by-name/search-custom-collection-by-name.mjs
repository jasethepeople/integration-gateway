import shopify from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/shopify/actions/search-custom-collection-by-name/search-custom-collection-by-name.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-search-custom-collection-by-name",
  version: "0.0.17",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
