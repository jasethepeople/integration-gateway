import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../_platform-shim.mjs";
import _twocaptcha from "../../app.mjs";
import sampleEmit from "../../shared/sources/captcha-solved/test-event.mjs";

export default {
  key: "_twocaptcha-captcha-solved",
  name: "New Captcha Solved",
  description: "Emit new event when a captcha has been successfully solved by the 2Captcha service.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    _twocaptcha,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the captcha task you want to get the result for.",
    },
  },
  methods: {
    generateMeta() {
      const ts = Date.now();
      return {
        id: `${this.taskId}-${ts}`,
        summary: "Chaptcha successfully solved!",
        ts,
      };
    },
    async startEvent() {
      let response = await this._twocaptcha.getTaskResult({
        data: {
          taskId: this.taskId,
        },
      });

      if (response.status && response.status === "ready") {
        this.$emit(response, this.generateMeta(response));
      }
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
