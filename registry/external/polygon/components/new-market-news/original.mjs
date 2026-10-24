import { parseNextPage } from "../../shared/common/utils.mjs";
import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-market-news/test-event.mjs";

export default {
  ...common,
  key: "polygon-new-market-news",
  name: "New Market News",
  description: "Emit new events when a news article related to the stock market is published.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.getNewsArticles;
    },
    getSummary(item) {
      return `New Market News: ${item.title}`;
    },
    getData(lastDate) {
      return {
        params: {
          "limit": 1000,
          "sort": "published_utc",
          "order": "desc",
          "published_utc.gt": lastDate,
        },
      };
    },
    parseData({
      results, next_url: next,
    }) {
      const parsedPage = parseNextPage(next);

      return {
        parsedData: results,
        nextPage: parsedPage,
      };
    },
  },
  sampleEmit,
};
