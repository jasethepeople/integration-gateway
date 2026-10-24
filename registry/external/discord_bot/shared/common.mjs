import discord from "../app.mjs";

export default {
  props: {
    discord,
    guildId: {
      propDefinition: [
        discord,
        "guild",
      ],
    },
  },
};
