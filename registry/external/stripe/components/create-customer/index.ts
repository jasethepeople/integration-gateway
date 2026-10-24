// Mirrored from PipedreamHQ/pipedream components/stripe/actions/create-customer/create-customer.mjs
// (see original.mjs). Adapted to the integration-gateway RuntimeContext:
//   this.stripe.$auth.api_key -> ctx.auth.api_key (or access_token)
//   stripe SDK call -> ctx.http POST https://api.stripe.com/v1/customers (form-encoded, Bearer auth)
//   $.export("$summary", ...) -> ctx.log
// The upstream file has many optional props; this mirror keeps the common scalar fields.
// No @pipedream/* imports remain.
import type { IIntegrationComponent, RuntimeContext, Steps } from "../../../_types.ts";
import { propsOf } from "../../../_helpers.ts";

interface CreateCustomerProps {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  metadata?: Record<string, string>;
  addressCity?: string;
  addressCountry?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressPostalCode?: string;
  addressState?: string;
}

const component: IIntegrationComponent = {
  def: {
    key: "stripe-create-customer",
    name: "Create a Customer",
    description: "Create a customer. https://stripe.com/docs/api/customers/create",
    version: "0.1.5",
    type: "action",
    propsSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        metadata: { type: "object" },
        addressCity: { type: "string" },
        addressCountry: { type: "string" },
        addressLine1: { type: "string" },
        addressLine2: { type: "string" },
        addressPostalCode: { type: "string" },
        addressState: { type: "string" },
      },
    },
  },

  async run(ctx: RuntimeContext, event: unknown, _steps: Steps): Promise<unknown> {
    const props = propsOf(event) as CreateCustomerProps;
    // this.stripe.$auth.api_key -> ctx.auth.api_key || ctx.auth.access_token
    const apiKey = ctx.auth.api_key ?? ctx.auth.access_token;
    if (!apiKey) throw new Error("auth.api_key (Stripe secret key) is required");

    // Stripe expects application/x-www-form-urlencoded with bracket notation.
    const form = new URLSearchParams();
    if (props.name) form.set("name", props.name);
    if (props.description) form.set("description", props.description);
    if (props.email) form.set("email", props.email);
    if (props.phone) form.set("phone", props.phone);
    if (props.metadata) {
      for (const [k, v] of Object.entries(props.metadata)) {
        form.set(`metadata[${k}]`, String(v));
      }
    }
    const addressMap: Record<string, string | undefined> = {
      city: props.addressCity,
      country: props.addressCountry,
      line1: props.addressLine1,
      line2: props.addressLine2,
      postal_code: props.addressPostalCode,
      state: props.addressState,
    };
    for (const [k, v] of Object.entries(addressMap)) {
      if (v) form.set(`address[${k}]`, v);
    }

    // POST https://api.stripe.com/v1/customers
    const res = await ctx.http("https://api.stripe.com/v1/customers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    const customer = (await res.json()) as {
      id?: string; error?: { message?: string }; [k: string]: unknown;
    };
    if (!res.ok || customer.error) {
      throw new Error(
        `stripe.customers.create failed: ${customer.error?.message ?? `HTTP ${res.status}`}`,
      );
    }

    // $.export("$summary", ...)
    ctx.log("info", `Successfully created customer ${customer.id}`);
    return customer;
  },
};

export default component;
