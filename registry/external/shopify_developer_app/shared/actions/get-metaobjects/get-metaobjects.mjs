import shopify from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/shopify/actions/get-metaobjects/get-metaobjects.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-get-metaobjects",
  version: "0.0.18",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
