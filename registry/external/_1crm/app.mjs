import { axios } from "../_platform-shim.mjs";
import { LIMIT } from "./shared/common/constants.mjs";

const __pdApp = {
  type: "app",
  app: "_1crm",
  propDefinitions: {
    recordId: {
      type: "string",
      label: "Contact ID",
      description: "ID of the contact",
      async options({
        page, model,
      }) {
        const { records } = await this.listModuleRecords({
          module: model,
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });

        return records.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.url}/api.php`;
    },
    _auth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.password}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    getFields({ module }) {
      return this._makeRequest({
        path: `/meta/fields/${module}`,
      });
    },
    listModuleRecords({
      module, ...opts
    }) {
      return this._makeRequest({
        path: `/data/${module}`,
        ...opts,
      });
    },
    createModel({
      model, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/data/${model}`,
        ...opts,
      });
    },
    updateModel({
      updateId, model, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/data/${model}/${updateId}`,
        ...opts,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "_1crm");
