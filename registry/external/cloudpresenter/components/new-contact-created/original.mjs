import cloudpresenter from "../../app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../_platform-shim.mjs";
import { getPaginatedResources } from "../../shared/common/utils.mjs";
import sampleEmit from "../../shared/sources/new-contact-created/test-event.mjs";

export default {
  key: "cloudpresenter-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a user adds a new contact in Cloudpresenter.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    cloudpresenter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact: ${contact.name}`,
        ts: Date.now(),
      };
    },
    async processEvent(max) {
      const items = await getPaginatedResources({
        resourceFn: this.cloudpresenter.listContacts,
        resourceType: "contacts",
        max,
      });

      for (const item of items) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
