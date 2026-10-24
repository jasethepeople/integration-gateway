import { axios } from "../_platform-shim.mjs";

const __pdApp = {
  type: "app",
  app: "habitify",
  propDefinitions: {
    habitIds: {
      type: "string[]",
      label: "Habit IDs",
      description: "The IDs of the habits to watch",
      async options() {
        const { data } = await this.getHabits();
        return data?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.habitify.me";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: this._apiKey(),
        },
        ...args,
      });
    },
    getHabits(args = {}) {
      return this._makeRequest({
        path: "/habits",
        ...args,
      });
    },
    getHabitStatus({
      habitId, ...args
    }) {
      return this._makeRequest({
        path: `/status/${habitId}`,
        ...args,
      });
    },
    getHabitLogs({
      habitId, ...args
    }) {
      return this._makeRequest({
        path: `/logs/${habitId}`,
        ...args,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "habitify");
