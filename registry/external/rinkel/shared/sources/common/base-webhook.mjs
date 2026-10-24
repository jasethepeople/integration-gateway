import rinkel from "../../../app.mjs";
import { ConfigurationError } from "../../../../_platform-shim.mjs";

export default {
  props: {
    rinkel,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      await this.rinkel.createWebhook({
        event: this.getEvent(),
        data: {
          url: this.http.endpoint,
          contentType: "application/json",
          active: true,
        },
      });
    },
    async deactivate() {
      await this.rinkel.deleteWebhook({
        event: this.getEvent(),
      });
    },
  },
  methods: {
    getEvent() {
      throw new ConfigurationError("getEvent must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
