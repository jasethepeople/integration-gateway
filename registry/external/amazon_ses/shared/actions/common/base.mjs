import amazonSes from "../../../app.mjs";

export default {
  props: {
    amazonSes,
    region: {
      propDefinition: [
        amazonSes,
        "region",
      ],
    },
  },
};
