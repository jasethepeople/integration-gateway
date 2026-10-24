import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../_platform-shim.mjs";
import _twocaptcha from "../../app.mjs";
import sampleEmit from "../../shared/sources/balance-updated/test-event.mjs";

export default {
  key: "_twocaptcha-balance-updated",
  name: "New 2Captcha Balance Updated",
  description: "Emit new event when the user's balance in 2Captcha API is changed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    _twocaptcha,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastBalance() {
      return this.db.get("lastBalance") || null;
    },
    _setLastBalance(lastBalance) {
      this.db.set("lastBalance", lastBalance);
    },
    generateMeta(currentBalance) {
      const ts = Date.now();
      return {
        id: `${currentBalance}-${ts}`,
        summary: `Balance Updated: ${currentBalance}`,
        ts,
      };
    },
    async startEvent() {
      const lastBalance = this._getLastBalance();

      let response = await this._twocaptcha.getBalance();

      if (!lastBalance || (lastBalance && response.balance != lastBalance)) {
        this.$emit(response, this.generateMeta(response.balance));
        this._setLastBalance(response.balance);
      }
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
