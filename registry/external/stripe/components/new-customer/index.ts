// Mirrored from PipedreamHQ/pipedream components/stripe/sources/new-customer/new-customer.mjs
// (see original.mjs). The upstream source is instant (Stripe webhook "customer.created");
// this mirror implements the same event as a polling source:
//   this.stripe.$auth.api_key -> ctx.auth.api_key (or access_token)
//   stripe SDK -> ctx.http GET https://api.stripe.com/v1/customers?created[gt]=cursor
//   $.interface.timer/apphook -> gateway scheduler invoking run() periodically
//   dedupe cursor via this.db -> ctx.store (max `created` seen)
//   $emit(customer, {summary, id, ts}) -> ctx.emit("stripe.new_customer", CanonicalEvent)
// No @pipedream/* imports remain.
import type { IIntegrationComponent, RuntimeContext, Steps } from "../../../_types.ts";
import { canonicalEvent } from "../../../_helpers.ts";

interface StripeCustomer {
  id: string;
  created: number;
  email?: string;
  name?: string;
  [k: string]: unknown;
}

const component: IIntegrationComponent = {
  def: {
    key: "stripe-new-customer",
    name: "New Customer",
    description: "Emit new event for each new customer (polling)",
    version: "0.1.5",
    type: "source",
    propsSchema: {
      type: "object",
      properties: {},
    },
  },

  async run(ctx: RuntimeContext, _event: unknown, _steps: Steps): Promise<unknown> {
    const apiKey = ctx.auth.api_key ?? ctx.auth.access_token;
    if (!apiKey) throw new Error("auth.api_key (Stripe secret key) is required");

    // Dedupe cursor: highest `created` timestamp emitted so far ($.service.db -> ctx.store)
    const storeKey = "lastCreated";
    const cursor = await ctx.store.get<number>(storeKey);

    const params = new URLSearchParams({ limit: "100" });
    if (cursor) params.set("created[gt]", String(cursor));
    // GET https://api.stripe.com/v1/customers
    const res = await ctx.http(`https://api.stripe.com/v1/customers?${params.toString()}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });
    const page = (await res.json()) as {
      data: StripeCustomer[]; has_more: boolean; error?: { message?: string };
    };
    if (!res.ok || page.error) {
      throw new Error(`stripe.customers.list failed: ${page.error?.message ?? `HTTP ${res.status}`}`);
    }

    // customers.list returns newest-first; emit oldest-first.
    const customers = page.data.slice().reverse();
    let maxCreated = cursor ?? 0;
    for (const customer of customers) {
      if (cursor && customer.created <= cursor) continue;
      // $emit(customer, { summary: `New customer: ${email||name||id}`, id, ts: created*1000 })
      const summary = `New customer: ${customer.email ?? customer.name ?? customer.id}`;
      ctx.log("info", summary, { id: customer.id });
      await ctx.emit(
        "stripe.new_customer",
        canonicalEvent(
          this.def.key,
          "stripe.new_customer",
          customer as unknown as Record<string, unknown>,
          { summary, dedupeId: customer.id, ts: customer.created * 1000 },
        ),
      );
      if (customer.created > maxCreated) maxCreated = customer.created;
    }

    if (maxCreated > (cursor ?? 0)) {
      await ctx.store.set(storeKey, maxCreated);
    }

    return { emitted: customers.length };
  },
};


export default component;
