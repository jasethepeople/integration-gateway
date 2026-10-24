// Mirrored from PipedreamHQ/pipedream components/slack_v2/sources/new-message-in-channels/new-message-in-channels.mjs
// (see original.mjs). The upstream source is instant (Slack Events API apphook); this mirror
// implements the same semantics as a polling source using conversations.history:
//   this.slack.$auth.oauth_access_token -> ctx.auth.access_token
//   this.slack.sdk()/makeRequest (axios) -> ctx.http against https://slack.com/api/*
//   $.interface.apphook -> gateway scheduler invoking run() periodically
//   dedupe: "unique" via this.db -> ctx.store cursor of latest message ts per channel
//   $emit(event, {summary}) -> ctx.emit("slack.new_message", CanonicalEvent)
// Subtype / ignoreBot / ignoreThreads filtering matches the upstream processEvent().
// No @pipedream/* imports remain.
import type { IIntegrationComponent, RuntimeContext, Steps } from "../../../_types.ts";
import { canonicalEvent, propsOf } from "../../../_helpers.ts";

interface SourceProps {
  conversations?: string[];
  ignoreBot?: boolean;
  ignoreThreads?: boolean;
}

interface SlackMessage {
  type: string;
  subtype?: string;
  ts: string;
  text?: string;
  user?: string;
  bot_id?: string;
  thread_ts?: string;
  channel?: string;
  [k: string]: unknown;
}

// Mirrors upstream constants.ALLOWED_MESSAGE_IN_CHANNEL_SUBTYPES:
// only "bot_message" and (implicitly) plain messages are allowed.
const ALLOWED_MESSAGE_IN_CHANNEL_SUBTYPES = ["bot_message"];

const component: IIntegrationComponent = {
  def: {
    key: "slack-new-message-in-channels",
    name: "New Message In Channels",
    description:
      "Emit new event when a new message is posted to one or more channels (polling via conversations.history)",
    version: "1.1.16",
    type: "source",
    propsSchema: {
      type: "object",
      properties: {
        conversations: {
          type: "array",
          items: { type: "string" },
          description: "Channel IDs to monitor for new messages",
        },
        ignoreBot: { type: "boolean", description: "Ignore bot messages" },
        ignoreThreads: { type: "boolean", description: "Ignore replies in threads" },
      },
      required: ["conversations"],
    },
  },

  async run(ctx: RuntimeContext, event: unknown, _steps: Steps): Promise<unknown> {
    const props = propsOf(event) as SourceProps;
    const token = ctx.auth.access_token;
    if (!token) throw new Error("auth.access_token is required");
    const channels =
      props.conversations ?? (ctx.config.conversations as string[] | undefined) ?? [];
    if (channels.length === 0) throw new Error("conversations (channel IDs) is required");

    const headers = { "Authorization": `Bearer ${token}` };
    let emitted = 0;

    for (const channel of channels) {
      // Dedupe cursor: latest ts already emitted for this channel ($.service.db -> ctx.store)
      const storeKey = `latestTs:${channel}`;
      const oldest = await ctx.store.get<string>(storeKey);

      // GET https://slack.com/api/conversations.history?channel=...&oldest=...&limit=100
      const params = new URLSearchParams({ channel, limit: "100" });
      if (oldest) params.set("oldest", oldest);
      const res = await ctx.http(
        `https://slack.com/api/conversations.history?${params.toString()}`,
        { headers },
      );
      const body = (await res.json()) as {
        ok: boolean; error?: string; messages?: SlackMessage[];
      };
      if (!res.ok || !body.ok) {
        throw new Error(`slack.conversations.history failed for ${channel}: ${body.error ?? `HTTP ${res.status}`}`);
      }

      // conversations.history returns newest-first; emit oldest-first.
      const messages = (body.messages ?? []).slice().reverse();
      let maxTs = oldest;

      for (const msg of messages) {
        // --- upstream processEvent() filtering ---
        if (msg.type !== "message") continue;
        if (msg.subtype && !ALLOWED_MESSAGE_IN_CHANNEL_SUBTYPES.includes(msg.subtype)) continue;
        if (props.ignoreBot && (msg.subtype === "bot_message" || msg.bot_id)) continue;
        if (props.ignoreThreads && msg.thread_ts) continue;

        // Skip the boundary message itself (oldest is inclusive in Slack).
        if (oldest && msg.ts <= oldest) continue;

        // $emit(event, { summary: "New message in channel" })
        const summary = "New message in channel";
        ctx.log("info", summary, { channel, ts: msg.ts });
        await ctx.emit(
          "slack.new_message",
          canonicalEvent(
            this.def.key,
            "slack.new_message",
            { ...msg, channel },
            { summary, dedupeId: `${channel}:${msg.ts}` },
          ),
        );
        emitted += 1;
        if (!maxTs || msg.ts > maxTs) maxTs = msg.ts;
      }

      if (maxTs && maxTs !== oldest) {
        await ctx.store.set(storeKey, maxTs);
      }
    }

    return { emitted };
  },
};

export default component;
