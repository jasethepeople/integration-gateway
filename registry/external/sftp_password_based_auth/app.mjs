// commented by ingest: import ... from "@pipedream/sftp";
const sftpApp = {}; // stubbed by ingest: base module unavailable;

const __pdApp = {
  ...sftpApp,
  type: "app",
  app: "sftp_password_based_auth",
  methods: {
    ...sftpApp.methods,
    getConfig() {
      const {
        host,
        username,
        password,
      } = this.$auth;

      return {
        host,
        username,
        password,
      };
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "sftp_password_based_auth");
