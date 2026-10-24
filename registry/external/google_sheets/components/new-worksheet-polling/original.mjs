import googleSheets from "../../app.mjs";
import common from "../../shared/sources/common/new-worksheet.mjs";
import base from "../../shared/sources/common/http-based/base.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../../_platform-shim.mjs";
import sampleEmit from "../../shared/sources/new-worksheet-polling/test-event.mjs";

export default {
  ...common,
  key: "google_sheets-new-worksheet-polling",
  name: "New Worksheet (Polling)",
  description: "Emit new event each time a new worksheet is created in a spreadsheet.",
  version: "0.0.5",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...common.hooks,
  },
  props: {
    googleSheets,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    watchedDrive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
    },
    sheetID: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.watchedDrive),
        }),
      ],
    },
  },
  methods: {
    ...base.methods,
    ...common.methods,
  },
  async run() {
    await this.processSpreadsheet({
      spreadsheetId: this.sheetID,
    });
  },
  sampleEmit,
};
