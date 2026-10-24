import sinch from "../../../app.mjs";
import { ConfigurationError } from "../../../../_platform-shim.mjs";

export default {
  props: {
    sinch,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    this.$emit(body, this.generateMeta(body));
  },
};
