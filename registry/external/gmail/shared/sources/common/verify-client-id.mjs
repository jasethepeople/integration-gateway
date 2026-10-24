import { PD_OFFICIAL_GMAIL_OAUTH_CLIENT_ID } from "../../../../_platform-shim.mjs";

export default {
  methods: {
    async checkClientId() {
      return !this.gmail.$auth.oauth_client_id.includes(PD_OFFICIAL_GMAIL_OAUTH_CLIENT_ID);
    },
  },
};
