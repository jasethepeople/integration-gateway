import meetingpulse from "../../app.mjs";
import common from "../../shared/sources/common.mjs";

export default {
  ...common,
  key: "meetingpulse-new-poll-data",
  name: "New Poll Data",
  description: "Emit new event every time the results of a poll change. [See the documentation](https://app.meet.ps/api/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    pollId: {
      propDefinition: [
        meetingpulse,
        "pollId",
        ({ meetingId }) => ({
          meetingId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    async getAndProcessData() {
      const poll = await this.meetingpulse.getPoll({
        meetingId: this.meetingId,
        pollId: this.pollId,
      });

      const previousPollResults = this._getSavedValue();
      const results = JSON.stringify(poll.results);

      if (results !== previousPollResults) {
        const ts = Date.now();
        this.$emit(poll, {
          id: ts,
          summary: `Poll updated: ${poll.question}`,
          ts,
        });
        this._setSavedValue(results);
      }
    },
  },
};
