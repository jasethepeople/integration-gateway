import { ConfigurationError } from "../../../../_platform-shim.mjs";
import app from "../../../app.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
  },
  methods: {
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      throw new ConfigurationError("getResourceFnArgs is not implemented");
    },
    getSummaryArgs() {
      throw new ConfigurationError("getSummaryArgs is not implemented");
    },
  },
  async run({ $: step }) {
    const {
      app,
      getResourceFn,
      getResourceFnArgs,
      getSummaryArgs,
    } = this;
    const resources = await app.paginate({
      resourceFn: getResourceFn(),
      resourceFnArgs: getResourceFnArgs(step),
      resourceName: "results",
    });

    step.export("$summary", `Successfully listed ${utils.summaryEnd(...getSummaryArgs(resources.length))}`);

    return resources;
  },
};
