import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/product-deleted/test-event.mjs";

export default {
  ...common,
  key: "lightspeed_ecom_c_series-product-deleted",
  name: "Product Deleted (Instant)",
  description: "Emit new event when a product is deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "products";
    },
    getItemAction() {
      return "deleted";
    },
    generateMeta(body, headers) {
      return {
        id: headers["x-product-id"],
        summary: `Product with ID ${headers["x-product-id"]} deleted`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
