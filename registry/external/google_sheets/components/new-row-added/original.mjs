import httpBase from "../../shared/sources/common/http-based/sheet.mjs";
import newRowAdded from "../../shared/sources/common/new-row-added.mjs";
import sampleEmit from "../../shared/sources/new-row-added/test-event.mjs";

export default {
  ...httpBase,
  ...newRowAdded,
  key: "google_sheets-new-row-added",
  name: "New Row Added (Instant)",
  description: "Emit new event each time a row or rows are added to the bottom of a spreadsheet.",
  version: "0.2.7",
  dedupe: "unique",
  type: "source",
  props: {
    ...httpBase.props,
    ...newRowAdded.props,
  },
  methods: {
    ...httpBase.methods,
    ...newRowAdded.methods,
  },
  sampleEmit,
};
