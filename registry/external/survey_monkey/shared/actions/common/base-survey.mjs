import surveyMonkey from "../../../app.mjs";

export default {
  props: {
    surveyMonkey,
    survey: {
      propDefinition: [
        surveyMonkey,
        "survey",
      ],
    },
  },
};
