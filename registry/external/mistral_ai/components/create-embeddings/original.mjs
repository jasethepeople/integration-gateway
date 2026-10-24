import mistralAI from "../../app.mjs";
import { parseArray } from "../../shared/common/utils.mjs";
import constants from "../../shared/common/constants.mjs";

export default {
  key: "mistral_ai-create-embeddings",
  name: "Create Embeddings",
  description: "Create new embedding in Mistral AI. [See the Documentation](https://docs.mistral.ai/api/#tag/embeddings)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mistralAI,
    input: {
      type: "string",
      label: "Input",
      description: "The input text for which to create an embedding. May be a string or an array of strings.",
    },
  },
  async run({ $ }) {
    const response = await this.mistralAI.createEmbeddings({
      $,
      data: {
        model: constants.EMBEDDINGS_MODEL,
        input: parseArray(this.input),
      },
    });
    if (response?.id) {
      $.export("$summary", `Successfully created embedding with ID: ${response.id}`);
    }
    return response;
  },
};
