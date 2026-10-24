// commented by ingest: import ... from "@pipedream/postgresql";
const postgresql = {}; // stubbed by ingest: base module unavailable;
import format from "pg-format";

const __pdApp = {
  type: "app",
  app: "neon_postgres",
  propDefinitions: {
    ...postgresql.propDefinitions,
  },
  methods: {
    ...postgresql.methods,
    getClientConfiguration() {
      const {
        host,
        port,
        user,
        password,
        database,
      } = this.$auth;

      return {
        host,
        port,
        user,
        password,
        database,
        ssl: this._getSslConfig(),
      };
    },
    upsertRow({
      schema, table, columns, values, conflictTarget = "id", errorMsg,
    } = {}) {
      const placeholders = this.getPlaceholders({
        values,
      });

      const updates = columns
        .filter((column) => column !== conflictTarget)
        .map((column) => `${column}=EXCLUDED.${column}`);

      const query = `
        INSERT INTO ${schema}.${table} (${columns})
          VALUES (${placeholders})
          ON CONFLICT (${conflictTarget})
          DO UPDATE SET ${updates}
          RETURNING *
      `;

      return this.executeQuery({
        text: format(query, schema, table),
        values,
        errorMsg,
      });
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "neon_postgres");
