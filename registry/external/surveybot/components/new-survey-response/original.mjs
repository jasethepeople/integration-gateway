import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../_platform-shim.mjs";
import surveybot from "../../app.mjs";
import sampleEmit from "../../shared/sources/new-survey-response/test-event.mjs";

export default {
  key: "surveybot-new-survey-response",
  name: "New Survey Response",
  description: "Emit new event when a new survey response is received. [See the documentation](https://app.surveybot.io/accounts/api_use_cases)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    surveybot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    surveyId: {
      propDefinition: [
        surveybot,
        "surveyId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const data = await this.surveybot.getSurveyResponses({
        surveyId: this.surveyId,
      });

      let responses = data.responses;

      responses = responses.filter((response) => Date.parse(response.started_at) > lastDate);

      if (responses.length) {
        if (maxResults && (responses.length > maxResults)) {
          responses.length = maxResults;
        }
        this._setLastDate(Date.parse(responses[0].started_at));
      }

      for (const item of responses.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New response for survey ${this.surveyId} by ${item.respondent.name}`,
          ts: Date.parse(item.started_at),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
