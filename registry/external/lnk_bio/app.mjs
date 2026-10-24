import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "lnk_bio",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new link",
    },
    link: {
      type: "string",
      label: "Link",
      description: "The URL of the new link",
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image associated with the link",
      optional: true,
    },
    linkId: {
      type: "string",
      label: "Link ID",
      description: "The ID of the link to delete",
    },
  },
  methods: {
    _baseUrl() {
      return "https://lnk.bio/oauth/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    async createLink(args) {
      return this._makeRequest({
        method: "POST",
        path: "/lnk/add",
        ...args,
      });
    },
    async deleteLink(args) {
      return this._makeRequest({
        method: "POST",
        path: "/lnk/delete",
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "lnk_bio");
