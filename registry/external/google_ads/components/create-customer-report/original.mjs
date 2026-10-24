import { customer } from "../../shared/common/resources/customer.mjs";
import { createReportComponent } from "../../shared/common/common-report.mjs";

export default {
  ...createReportComponent(customer),
  key: "google_ads-create-customer-report",
  name: "Create Customer Report",
  description: "Creates a report for the Customer resource. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/GoogleAdsService/Search?transport=rest)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
};
