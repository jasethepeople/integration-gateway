import googleAds from "../../app.mjs";

export default {
  googleAds,
  accountId: {
    propDefinition: [
      googleAds,
      "accountId",
    ],
  },
  customerClientId: {
    propDefinition: [
      googleAds,
      "customerClientId",
      ({ accountId }) => ({
        accountId,
      }),
    ],
  },
};
