import facebookPages from "../../../app.mjs";

export default {
  props: {
    facebookPages,
    page: {
      propDefinition: [
        facebookPages,
        "page",
      ],
    },
  },
};
