import httpBase from "../../shared/sources/common/http-based/sheet.mjs";
import newWorksheet from "../../shared/sources/common/new-worksheet.mjs";
import sampleEmit from "../../shared/sources/new-worksheet/test-event.mjs";

export default {
  ...httpBase,
  ...newWorksheet,
  key: "google_sheets-new-worksheet",
  type: "source",
  name: "New Worksheet (Instant)",
  description: "Emit new event each time a new worksheet is created in a spreadsheet.",
  version: "0.2.7",
  dedupe: "unique",
  hooks: {
    ...httpBase.hooks,
    ...newWorksheet.hooks,
  },
  props: {
    ...httpBase.props,
    ...newWorksheet.props,
  },
  methods: {
    ...httpBase.methods,
    ...newWorksheet.methods,
  },
  sampleEmit,
};
