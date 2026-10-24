import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../../_platform-shim.mjs";
import orcaScan from "../../../app.mjs";

export default {
  props: {
    orcaScan,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async startEvent(maxResults = false) {
      const lastInfo = this._getLastInfo();
      const data = await this.getData(maxResults, lastInfo);

      if (data.length) this._setLastInfo(data[0]);

      for (const item of data.reverse()) {
        this.$emit(item, this.getEmit(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
