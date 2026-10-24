import common from "../../shared/sources/common/base.mjs";
import sampleEmit from "../../shared/sources/new-signed-document/test-event.mjs";

export default {
  ...common,
  key: "signaturit-new-signed-document",
  name: "New Signed Document",
  description: "Emit new event when a document has been newly signed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  sampleEmit,
};
