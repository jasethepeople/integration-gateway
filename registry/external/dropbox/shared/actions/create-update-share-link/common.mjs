import dropbox from "../../../app.mjs";

export default {
  props: {
    dropbox: {
      ...dropbox,
      reloadProps: true,
    },
  },
};
