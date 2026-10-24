import common from "../../shared/sources/common/base.mjs";
import {
  getCommandId,
  getTimestamp,
} from "../../shared/common/utils.mjs";
import sampleEmit from "../../shared/sources/new-ffmpeg-command/test-event.mjs";

export default {
  ...common,
  key: "renderio-new-ffmpeg-command",
  name: "New FFmpeg Command",
  description: "Emit new event when a new FFmpeg command is submitted. [See the documentation](https://renderio.dev/docs/api-reference/commands/list-commands)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(command) {
      const commandId = getCommandId(command);
      return {
        id: commandId,
        summary: `New FFmpeg command: ${commandId}`,
        ts: getTimestamp(command),
      };
    },
    getFn() {
      return this.renderio.listCommands;
    },
    getListKey() {
      return "commands";
    },
  },
  sampleEmit,
};
