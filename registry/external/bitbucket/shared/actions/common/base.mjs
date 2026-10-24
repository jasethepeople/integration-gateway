import bitbucket from "../../../app.mjs";

export default {
  props: {
    bitbucket,
    workspaceId: {
      propDefinition: [
        bitbucket,
        "workspace",
      ],
    },
  },
};
