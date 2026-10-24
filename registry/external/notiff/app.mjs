// commented by ingest: import ... from "@pipedream/notiff_io";
const notiffIo = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...notiffIo,
  type: "app",
  app: "notiff",
  methods: {
    ...notiffIo.methods,
    _headers() {
      return {
        "Content-Type": "application/json",
      };
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "notiff");
