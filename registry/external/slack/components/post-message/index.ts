// Mirrored from PipedreamHQ/pipedream components/slack_v2/actions/post-message/post-message.mjs
// (see original.mjs). Adapted to the integration-gateway RuntimeContext:
//   this.slack.$auth.oauth_access_token -> ctx.auth.access_token
//   this.slack.postChatMessage(...) (axios via @pipedream/platform) -> ctx.http POST https://slack.com/api/chat.postMessage
//   ConfigurationError -> plain Error
//   $.export("$summary", ...) -> ctx.log
// The upstream sendAsBot channel-resolution path (conversations.invite etc.) is simplified:
// pass as_user=false through directly when requested.
// No @pipedream/* imports remain.
import type { IIntegrationComponent, RuntimeContext, Steps } from "../../../_types.ts";
import { propsOf } from "../../../_helpers.ts";

interface PostMessageProps {
  channel?: string;
  text?: string;
  blocks?: string;
  threadTs?: string;
  replyBroadcast?: boolean;
  unfurlLinks?: boolean;
  unfurlMedia?: boolean;
  mrkdwn?: boolean;
  sendAsBot?: boolean;
}

const component: IIntegrationComponent = {
  def: {
    key: "slack-post-message",
    name: "Post Message",
    description:
      "Send a message to a channel, user, or group. Supports plain text with Slack mrkdwn " +
      "formatting and Block Kit blocks.",
    version: "0.1.6",
    type: "action",
    propsSchema: {
      type: "object",
      properties: {
        channel: { type: "string", description: "Channel ID or name, e.g. `C1234567890`" },
        text: { type: "string", description: "Message text (mrkdwn supported)" },
        blocks: { type: "string", description: "JSON array of Block Kit blocks" },
        threadTs: { type: "string", description: "Parent message ts for threaded replies" },
        replyBroadcast: { type: "boolean", default: false },
        unfurlLinks: { type: "boolean", default: true },
        unfurlMedia: { type: "boolean", default: true },
        mrkdwn: { type: "boolean", default: true },
        sendAsBot: { type: "boolean", default: false },
      },
      required: ["channel", "text"],
    },
  },

  async run(ctx: RuntimeContext, event: unknown, _steps: Steps): Promise<unknown> {
    const props = propsOf(event) as PostMessageProps;
    const token = ctx.auth.access_token;
    if (!token) throw new Error("auth.access_token is required");
    if (!props.channel) throw new Error("channel is required");
    if (!props.text && !props.blocks) throw new Error("text or blocks is required");

    // this.slack.normalizeChannel(this.channel): strip a leading '#' from channel names
    const channel = props.channel.replace(/^#/, "");

    const args: Record<string, unknown> = {
      channel,
      text: props.text,
      mrkdwn: props.mrkdwn ?? true,
      unfurl_links: props.unfurlLinks ?? true,
      unfurl_media: props.unfurlMedia ?? true,
    };
    if (props.blocks) {
      try {
        args.blocks = JSON.parse(props.blocks);
      } catch (error) {
        // ConfigurationError -> Error
        throw new Error(`Invalid JSON string in blocks: ${(error as Error).message}`);
      }
    }
    if (props.threadTs) {
      args.thread_ts = props.threadTs;
      args.reply_broadcast = props.replyBroadcast ?? false;
    }
    if (props.sendAsBot) {
      args.as_user = false;
    }

    // POST https://slack.com/api/chat.postMessage
    const res = await ctx.http("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(args),
    });
    const response = (await res.json()) as {
      ok: boolean; error?: string; channel?: string; ts?: string; [k: string]: unknown;
    };
    if (!res.ok || !response.ok) {
      throw new Error(`slack.chat.postMessage failed: ${response.error ?? `HTTP ${res.status}`}`);
    }

    // $.export("$summary", ...)
    ctx.log("info", `Message sent to ${response.channel}${props.threadTs ? " (thread reply)" : ""}`);
    return response;
  },
};

export default component;
