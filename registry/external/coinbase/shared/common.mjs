import coinbase from "../app.mjs";

export default {
  props: {
    coinbase,
    accountId: {
      propDefinition: [
        coinbase,
        "accountId",
      ],
    },
  },
};
