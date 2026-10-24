import asin_data_api from "../../app.mjs";

export default {
  key: "asin_data_api-list-collection-id-options",
  name: "List Collection ID Options",
  description: "Retrieves available options for the Collection ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    asin_data_api,
  },
  async run({ $ }) {
    const options = await asin_data_api.propDefinitions.collectionId.options
      .call(this.asin_data_api, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
