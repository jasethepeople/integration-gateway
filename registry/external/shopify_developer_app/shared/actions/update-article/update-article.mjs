import shopify from "../../../app.mjs";
// commented by ingest: import ... from "@pipedream/shopify/actions/update-article/update-article.mjs";
const common = {}; // stubbed by ingest: base module unavailable;
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-update-article",
  version: "0.0.19",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
