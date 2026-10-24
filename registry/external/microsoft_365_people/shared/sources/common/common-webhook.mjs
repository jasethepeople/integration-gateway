import microsoftOutlook from "../../../app.mjs";
// commented by ingest: import ... from "../../../microsoft_outlook/sources/common/common.mjs";
const common = {}; // stubbed by ingest: base module unavailable;

export default {
  ...common,
  props: {
    ...common.props,
    microsoftOutlook,
  },
  methods: {
    ...common.methods,
    emitEvent(item) {
      this.$emit(item, this.generateMeta(item));
    },
  },
};
