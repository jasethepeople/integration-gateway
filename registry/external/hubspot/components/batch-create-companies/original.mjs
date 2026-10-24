import { ConfigurationError } from "../../../_platform-shim.mjs";
import { API_PATH } from "../../shared/common/constants.mjs";
import { parseObject } from "../../shared/common/utils.mjs";
import hubspot from "../../app.mjs";

export default {
  key: "hubspot-batch-create-companies",
  name: "Batch Create Companies",
  description:
    "Create a batch of companies in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fcreate)",
  version: "0.0.18",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    inputs: {
      type: "string[]",
      label: "Inputs (Companies)",
      description:
        "Provide a **list of companies** to be created. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fcreate) for more information. Example: `[ { \"properties\": { \"name\": \"CompanyName\"} } ]`",
    },
  },
  methods: {
    batchCreateCompanies(opts = {}) {
      return this.hubspot.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/objects/companies/batch/create",
        method: "POST",
        ...opts,
      });
    },
  },
  async run({ $ }) {
    try {
      const response = await this.batchCreateCompanies({
        $,
        data: {
          inputs: parseObject(this.inputs),
        },
      });
      $.export(
        "$summary",
        `Created ${response.results.length} compan${
          response.results.length === 1
            ? "y"
            : "ies"
        }`,
      );
      return response;
    } catch (error) {
      const message = JSON.parse(
        JSON.parse(error.message).message.split(/:(.+)/)[1],
      )[0].message;
      throw new ConfigurationError(message.split(/:(.+)/)[0]);
    }
  },
};
