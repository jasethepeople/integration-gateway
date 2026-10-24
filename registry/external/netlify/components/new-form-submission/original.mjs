import webhook from "../../shared/sources/common/webhook.mjs";
import { deployHooks } from "../../shared/sources/common/constants.mjs";

export default {
  ...webhook,
  key: "netlify-new-form-submission",
  name: "New Form Submission (Instant)",
  description: "Emit new event when a user submits a form",
  type: "source",
  version: "0.1.1",
  dedupe: "unique",
  methods: {
    ...webhook.methods,
    getHookEvent() {
      return deployHooks.SUBMISSION_CREATED;
    },
    getMetaSummary(data) {
      const { form_name: formName } = data;
      return `New form submission for ${formName}`;
    },
  },
};
