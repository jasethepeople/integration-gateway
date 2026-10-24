// Mirrored from PipedreamHQ/pipedream components/stripe/actions/list-customers/list-customers.mjs
// (see original.mjs). Adapted to the integration-gateway RuntimeContext:
//   this.stripe.$auth.api_key -> ctx.auth.api_key (or access_token)
//   app.paginate({collection: "customers", ...}) (stripe SDK) -> ctx.http GET /v1/customers with
//     manual auto-pagination via starting_after
//   ConfigurationError -> plain Error
//   $.export("$summary", ...) -> ctx.log
// No @pipedream/* imports remain.
import type { IIntegrationComponent, RuntimeContext, Steps } from "../../../_types.ts";
import { propsOf } from "../../../_helpers.ts";

interface ListCustomersProps {
  email?: string;
  limit?: number;
  createdGt?: string | number;
  createdGte?: string | number;
  createdLt?: string | number;
  createdLte?: string | number;
  endingBefore?: string;
  startingAfter?: string;
  returnPaginationInfo?: boolean;
}

interface StripePage<T> {
  data: T[];
  has_more: boolean;
  error?: { message?: string };
}

// mirrors components/stripe/common/utils.mjs fromDateToInteger: accepts unix seconds or a
// Date-parseable string and returns integer unix seconds.
function fromDateToInteger(v: string | number | undefined): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "number") return Math.trunc(v);
  if (/^\d+$/.test(v)) return parseInt(v, 10);
  const ms = Date.parse(v);
  if (Number.isNaN(ms)) throw new Error(`Invalid date value: ${v}`);
  return Math.floor(ms / 1000);
}

const component: IIntegrationComponent = {
  def: {
    key: "stripe-list-customers",
    name: "List Customers",
    description:
      "Find or list customers, auto-paginated up to `limit` (default 10000); with " +
      "returnPaginationInfo returns a single page { data, has_more, next_starting_after }.",
    version: "0.2.1",
    type: "action",
    propsSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Search by customer email (case-sensitive)" },
        limit: { type: "integer", description: "Max records to return" },
        createdGt: { type: ["string", "integer"] },
        createdGte: { type: ["string", "integer"] },
        createdLt: { type: ["string", "integer"] },
        createdLte: { type: ["string", "integer"] },
        endingBefore: { type: "string" },
        startingAfter: { type: "string" },
        returnPaginationInfo: { type: "boolean" },
      },
    },
  },

  async run(ctx: RuntimeContext, event: unknown, _steps: Steps): Promise<unknown> {
    const props = propsOf(event) as ListCustomersProps;
    const apiKey = ctx.auth.api_key ?? ctx.auth.access_token;
    if (!apiKey) throw new Error("auth.api_key (Stripe secret key) is required");

    const limit = props.limit ?? 10000;
    if (props.returnPaginationInfo && limit > 100) {
      throw new Error(
        "When `returnPaginationInfo` is enabled, `limit` must be 100 or fewer (Stripe caps " +
        "single-page responses at 100).",
      );
    }
    if (props.startingAfter && props.endingBefore) {
      throw new Error("Use either `startingAfter` or `endingBefore`, not both.");
    }

    const baseParams = (): URLSearchParams => {
      const p = new URLSearchParams();
      if (props.email) p.set("email", props.email);
      const created: [string, string | number | undefined][] = [
        ["gt", props.createdGt],
        ["gte", props.createdGte],
        ["lt", props.createdLt],
        ["lte", props.createdLte],
      ];
      for (const [op, v] of created) {
        const n = fromDateToInteger(v);
        if (n !== undefined) p.set(`created[${op}]`, String(n));
      }
      if (props.endingBefore) p.set("ending_before", props.endingBefore);
      return p;
    };

    const headers = { "Authorization": `Bearer ${apiKey}` };
    const fetchPage = async (startingAfter?: string): Promise<StripePage<Record<string, unknown>>> => {
      const p = baseParams();
      p.set("limit", String(Math.min(100, props.returnPaginationInfo ? limit : 100)));
      if (startingAfter) p.set("starting_after", startingAfter);
      // GET https://api.stripe.com/v1/customers
      const res = await ctx.http(`https://api.stripe.com/v1/customers?${p.toString()}`, { headers });
      const page = (await res.json()) as StripePage<Record<string, unknown>>;
      if (!res.ok || page.error) {
        throw new Error(`stripe.customers.list failed: ${page.error?.message ?? `HTTP ${res.status}`}`);
      }
      return page;
    };

    if (props.returnPaginationInfo) {
      const page = await fetchPage(props.startingAfter);
      const result = {
        data: page.data,
        has_more: page.has_more,
        next_starting_after: page.has_more && page.data.length > 0
          ? (page.data[page.data.length - 1].id as string)
          : undefined,
      };
      const count = page.data.length;
      ctx.log("info", `Successfully fetched ${count} customer${count === 1 ? "" : "s"}${page.has_more ? " (more available)" : ""}`);
      return result;
    }

    // Auto-pagination up to `limit`
    const all: Record<string, unknown>[] = [];
    let startingAfter = props.startingAfter;
    while (all.length < limit) {
      const page = await fetchPage(startingAfter);
      all.push(...page.data);
      if (!page.has_more || page.data.length === 0) break;
      startingAfter = page.data[page.data.length - 1].id as string;
    }
    const result = all.slice(0, limit);
    ctx.log("info", `Successfully fetched ${result.length} customer${result.length === 1 ? "" : "s"}`);
    return result;
  },
};

export default component;
