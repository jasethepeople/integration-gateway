import constants from "../../shared/common/constants.mjs";
import common from "../../shared/sources/common/timer-based.mjs";

export default {
  ...common,
  type: "source",
  key: "ghost_org_content_api-new-author",
  name: "New Author",
  description: "Emit new event for each new author added on a site.",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.ghostContentApi.getAuthors;
    },
    getResourceFnArgs() {
      return {
        params: {
          limit: constants.DEFAULT_LIMIT,
        },
      };
    },
    getResourceName() {
      return "authors";
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.now(),
        summary: `Author ID ${resource.id}`,
      };
    },
  },
};
