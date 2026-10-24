import clickup from "../../../app.mjs";

export default {
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
    },
  },
};
