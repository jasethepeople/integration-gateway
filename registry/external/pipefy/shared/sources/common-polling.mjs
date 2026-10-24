import common from "./common.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../_platform-shim.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run(event) {
    const cards = await this.pipefy.listCards(this.pipeId);
    for (const edge of cards.edges) {
      const { node } = edge;
      if (!this.isCardRelevant({
        node,
        event,
      })) continue;
      const meta = this.getMeta({
        node,
        event,
      });
      this.$emit(node, meta);
    }
  },
};
