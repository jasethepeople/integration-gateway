// x-pd-ai: optimized
import Mixpanel from "mixpanel";

const __pdApp = {
  type: "app",
  app: "mixpanel",
  propDefinitions: {},
  methods: {
    _client() {
      return Mixpanel.init(this.$auth.token, {
        protocol: "https",
      });
    },
    trackEvent({
      event, properties,
    }) {
      return new Promise((resolve, reject) => this._client().track(
        event,
        {
          ...properties,
        },
        (error) => error
          ? reject(error)
          : resolve(),
      ));
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "mixpanel");
