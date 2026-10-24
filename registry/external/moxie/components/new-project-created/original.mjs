import common from "../../shared/sources/common/common.mjs";
import sampleEmit from "../../shared/sources/new-project-created/test-event.mjs";

export default {
  ...common,
  key: "moxie-new-project-created",
  name: "New Project Created",
  version: "0.0.1",
  description: "Emit new event when a new project is created.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    clientName: {
      propDefinition: [
        common.props.moxie,
        "clientName",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResources() {
      return this.moxie.listProjects({
        params: {
          query: this.clientName,
        },
      });
    },
    getTsKey() {
      return "dateCreated";
    },
    generateMeta(project) {
      return {
        id: project.id,
        summary: project.name,
        ts: Date.parse(project[this.getTsKey()]),
      };
    },
  },
  sampleEmit,
};
